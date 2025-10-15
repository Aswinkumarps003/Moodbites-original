// server.js

// Import necessary modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import multer for file uploads
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// cloudinary already imported above

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true);
  }
});

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process if database connection fails
  });

// Define Mongoose Schemas and Models (Embedded Messages)
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "audio", "plan"],
    default: "text",
  },
  // Plan-specific fields (optional)
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },
  planName: { type: String },
  totalCalories: { type: String },
  preferences: { type: mongoose.Schema.Types.Mixed },
  meals: { type: [Object] },
  // File-related fields
  fileName: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  fileType: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  filePublicId: {
    type: String, // Cloudinary public ID for file management
  },
  // Audio-specific fields
  audioUrl: {
    type: String,
  },
  audioPublicId: {
    type: String, // Cloudinary public ID for audio management
  },
  audioDuration: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema], // Embedded messages
  lastMessage: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastUpdated: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`📝 ${userId} joined their room: user-${userId}`);
  });

  socket.on('send-message', async (data) => {
    console.log('💬 Message received:', data);
    try {
      // Convert senderId and receiverId strings to ObjectId
      const senderObjectId = new mongoose.Types.ObjectId(data.senderId);
      const receiverObjectId = new mongoose.Types.ObjectId(data.receiverId);

      // Create new message object
      const newMessage = {
        senderId: senderObjectId,
        receiverId: receiverObjectId,
        message: data.message,
        messageType: data.messageType,
        createdAt: new Date(),
        isRead: false,
        // File-related fields
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        fileUrl: data.fileUrl,
        filePublicId: data.filePublicId,
        // Audio-specific fields
        audioUrl: data.audioUrl,
        audioPublicId: data.audioPublicId,
        audioDuration: data.audioDuration,
      };

      // Step 1: Find existing conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderObjectId, receiverObjectId] },
      });

      // Step 2: If not exists → create new conversation
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderObjectId, receiverObjectId],
          messages: [],
          lastMessage: "",
          lastUpdated: new Date(),
        });
      }

      // Step 3: Push message and update metadata
      conversation.messages.push(newMessage);
      conversation.lastMessage = data.message;
      conversation.lastUpdated = new Date();

      await conversation.save();

      // Step 4: Emit events
      socket.to(`user-${data.receiverId}`).emit('receive-message', {
        ...newMessage,
        conversationId: conversation._id,
      });

      socket.emit('message-sent', {
        ...newMessage,
        conversationId: conversation._id,
      });

      console.log(`💬 Message saved from ${data.senderId} to ${data.receiverId}`);
    } catch (error) {
      console.error('❌ Error saving message:', error);
      socket.emit('message-error', { error: 'Failed to send message.' });
    }
  });

  socket.on('mark-as-read', async (data) => {
    try {
      const { conversationId, messageId, userId } = data;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      // Convert userId to ObjectId for comparison
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Find the message in the embedded messages array
      const message = conversation.messages.find(msg => 
        msg._id.toString() === messageId && 
        msg.receiverId.toString() === userObjectId.toString()
      );
      
      if (message) {
        message.isRead = true;
        await conversation.save();

        // Notify sender that message was read
        socket.to(`user-${message.senderId}`).emit('message-read', {
          messageId,
          conversationId,
        });
      }
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { receiverId, senderId, isTyping } = data;
    socket.to(`user-${receiverId}`).emit('user-typing', {
      senderId,
      isTyping,
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Define REST API endpoints for fetching data
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    console.log('🔍 Fetching conversations for user:', req.params.userId);
    
    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(req.params.userId);
    console.log('🔍 Converted to ObjectId:', userObjectId);
    
    // Find conversations where the user is a participant
    const conversations = await Conversation.find({ 
      participants: { $in: [userObjectId] } 
    }).sort({ lastUpdated: -1 });
    
    console.log('🔍 Found conversations:', conversations.length);
    res.json(conversations);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get messages for a specific conversation
app.get('/api/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Return the embedded messages array
    res.json(conversation.messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Conversation stats endpoint
app.get('/api/conversations/:conversationId/stats', async (req, res) => {
  try {
    const stats = await Conversation.findById(req.params.conversationId);
    if (!stats) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const totalMessages = stats.messages.length;
    const unreadMessages = stats.messages.filter(msg => !msg.isRead).length;
    res.json({ totalMessages, unreadMessages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation stats', error });
  }
});

// File upload endpoints with Cloudinary
app.post('/api/upload/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video', // Cloudinary treats audio as video
      folder: 'moodbites/audio',
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    const duration = 0; // You can use ffmpeg or similar to get actual duration
    
    res.json({
      audioUrl: result.secure_url,
      publicId: result.public_id,
      duration,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Error uploading audio to Cloudinary:', error);
    // Clean up local file if upload failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

app.post('/api/upload/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileType = req.body.fileType || 'other';
    let resourceType = 'auto';
    let folder = 'moodbites/files';

    // Determine resource type and folder based on file type
    if (fileType === 'image') {
      resourceType = 'image';
      folder = 'moodbites/images';
    } else if (fileType === 'video') {
      resourceType = 'video';
      folder = 'moodbites/videos';
    } else if (fileType === 'audio') {
      resourceType = 'video'; // Cloudinary treats audio as video
      folder = 'moodbites/audio';
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resourceType,
      folder: folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);
    
    res.json({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType
    });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    // Clean up local file if upload failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete file from Cloudinary
app.delete('/api/upload/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'auto' } = req.query;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    res.json({
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'File deleted successfully' : 'File not found'
    });
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Serve uploaded files (fallback for local files)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chat service is healthy' });
});

// Listen on the specified port
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`🚀 Chat service running on http://localhost:${PORT}`);
});