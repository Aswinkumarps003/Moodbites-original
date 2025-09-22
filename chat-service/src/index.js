import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
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
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .sort({ lastUpdated: -1 });

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
