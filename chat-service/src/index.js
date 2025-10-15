import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Conversation from "./models/Chat.js";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure Cloudinary (optional uploads)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 },
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/moodbites_chat";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on("join-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room: user-${userId}`);
  });

  // Handle new message
  socket.on("send-message", async (data) => {
    try {
      const { senderId, receiverId, message, messageType = "text" } = data;

      // Find or create conversation using the correct query structure
      let conversation = await Conversation.findOneAndUpdate(
        { 
          participants: { 
            $all: [senderId, receiverId] 
          }
        },
        { 
          $setOnInsert: { 
            participants: [senderId, receiverId],
            messages: [],
            lastMessage: "",
            lastUpdated: new Date()
          }
        },
        { 
          upsert: true, 
          new: true, 
          setDefaultsOnInsert: true 
        }
      );

      // Create new message object
      const newMessage = {
        senderId,
        receiverId,
        message,
        messageType,
        createdAt: new Date(),
        isRead: false,
        // Plan fields passthrough
        planId: data.planId,
        planName: data.planName,
        totalCalories: data.totalCalories,
        preferences: data.preferences,
        meals: data.meals,
        // File fields passthrough
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        fileUrl: data.fileUrl,
        filePublicId: data.filePublicId,
        // Audio fields passthrough
        audioUrl: data.audioUrl,
        audioPublicId: data.audioPublicId,
        audioDuration: data.audioDuration,
      };

      // Add message to conversation and update
      conversation.messages.push(newMessage);
      conversation.lastMessage = message;
      conversation.lastUpdated = new Date();

      await conversation.save();

      // Emit message to receiver
      socket.to(`user-${receiverId}`).emit("receive-message", {
        ...newMessage,
        conversationId: conversation._id,
      });

      // Emit message back to sender for confirmation
      socket.emit("message-sent", {
        ...newMessage,
        conversationId: conversation._id,
      });

      console.log(`💬 Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("message-error", { error: "Failed to send message" });
    }
  });

  // Handle message read status
  socket.on("mark-as-read", async (data) => {
    try {
      const { conversationId, messageId, userId } = data;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      // Find the message in the embedded messages array
      const message = conversation.messages.find(msg => 
        msg._id.toString() === messageId && 
        msg.receiverId.toString() === userId
      );
      
      if (message) {
        message.isRead = true;
        await conversation.save();

        // Notify sender that message was read
        socket.to(`user-${message.senderId}`).emit("message-read", {
          messageId,
          conversationId,
        });
      }
    } catch (error) {
      console.error("❌ Error marking message as read:", error);
    }
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    const { receiverId, senderId, isTyping } = data;
    socket.to(`user-${receiverId}`).emit("user-typing", {
      senderId,
      isTyping,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`👤 User disconnected: ${socket.id}`);
  });
});

// API Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "chat-service" });
});

// Get conversation history
app.get("/api/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (e) {
      userObjectId = null;
    }

    const conversations = await Conversation.find({
      participants: { $in: userObjectId ? [userObjectId, userId] : [userId] },
    }).sort({ lastUpdated: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get messages for a specific conversation
app.get("/api/conversations/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Return the embedded messages array
    res.json(conversation.messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Upload audio
app.post("/api/upload/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "moodbites/audio",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    fs.unlinkSync(req.file.path);
    res.json({
      audioUrl: result.secure_url,
      audioPublicId: result.public_id,
      duration: 0,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error("Error uploading audio to Cloudinary:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to upload audio" });
  }
});

// Upload generic file/image
app.post("/api/upload/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const fileType = req.body.fileType || "auto";
    let resourceType = "auto";
    let folder = "moodbites/files";
    if (fileType === "image") {
      resourceType = "image";
      folder = "moodbites/images";
    } else if (fileType === "video") {
      resourceType = "video";
      folder = "moodbites/videos";
    } else if (fileType === "audio") {
      resourceType = "video";
      folder = "moodbites/audio";
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resourceType,
      folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    fs.unlinkSync(req.file.path);
    res.json({
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType,
    });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Delete file from Cloudinary
app.delete("/api/upload/delete/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType = "auto" } = req.query;
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ success: result.result === "ok", message: result.result });
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Serve static uploads (fallback)
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 3006;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Chat service running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

export default app;
