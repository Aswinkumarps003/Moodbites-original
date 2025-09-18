// test-client.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3006");

socket.on("connect", () => {
  console.log("✅ Connected to chat service");

  socket.emit("join-room", "test-user-123");
  console.log("📝 Joined room for test-user-123");

  setTimeout(() => {
    socket.emit("send-message", {
      senderId: "test-user-123",
      receiverId: "test-dietician-456",
      message: "Hello, I need help with my diet plan!",
      messageType: "text",
    });
    console.log("💬 Sent test message");
  }, 1000);
});

socket.on("receive-message", (data) => {
  console.log("📨 Received message:", data);
});

socket.on("message-sent", (data) => {
  console.log("✅ Message sent confirmation:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from chat service");
});
