// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow any origin for testing
  },
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`📝 ${userId} joined their room`);
  });

  socket.on("send-message", (data) => {
    console.log("💬 Message received:", data);

    // Send to receiver’s room
    io.to(data.receiverId).emit("receive-message", data);

    // Confirm to sender
    socket.emit("message-sent", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(3006, () => {
  console.log("🚀 Chat service running on http://localhost:3006");
});
