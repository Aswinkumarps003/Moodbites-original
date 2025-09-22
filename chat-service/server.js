// server.js

// Import necessary modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors());
app.use(express.json());

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
    enum: ["text", "image", "file"],
    default: "text",
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chat service is healthy' });
});

// Listen on the specified port
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`🚀 Chat service running on http://localhost:${PORT}`);
});