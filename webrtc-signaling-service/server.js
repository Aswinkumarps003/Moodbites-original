// WebRTC Signaling Server
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://moodbites-frontend.vercel.app',
      'https://moodbites-frontend-eyjvu60bc-aswin-kumar-p-ss-projects.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://moodbites-frontend.vercel.app',
    'https://moodbites-frontend-eyjvu60bc-aswin-kumar-p-ss-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 3007;

// Store active connections
const activeConnections = new Map();

// Handle connection errors
io.on('connection_error', (err) => {
  console.log('❌ Connection error:', err.message);
  console.log('Error details:', err);
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  console.log(`Connection time: ${new Date().toISOString()}`);
  
  // Get user info from handshake or query params
  const userId = socket.handshake.query.userId || socket.handshake.auth?.userId || `user-${socket.id}`;
  const userName = socket.handshake.query.userName || socket.handshake.auth?.userName || `User-${socket.id.slice(0, 6)}`;
  
  socket.userId = userId;
  socket.userName = userName;
  
  // Store user connection
  activeConnections.set(userId, {
    socketId: socket.id,
    userId: userId,
    userName: userName,
    connectedAt: new Date()
  });

  console.log(`📝 User info: ${userName} (${userId})`);

  // Join user's personal room
  socket.join(userId);

  // Handle explicit room joining (for client compatibility)
  socket.on('join-room', (roomId) => {
    console.log(`🏠 ${socket.userName} joining room: ${roomId}`);
    socket.join(roomId);
  });

  // Handle WebRTC offer
  socket.on('webrtc-offer', (data) => {
    console.log(`📞 Offer from ${socket.userName} to ${data.targetUserId}`);
    
    // Forward offer to target user
    socket.to(data.targetUserId).emit('webrtc-offer', {
      offer: data.offer,
      senderId: socket.userId,
      senderName: socket.userName
    });
  });

  // Handle WebRTC answer
  socket.on('webrtc-answer', (data) => {
    console.log(`📞 Answer from ${socket.userName} to ${data.targetUserId}`);
    
    // Forward answer to target user
    socket.to(data.targetUserId).emit('webrtc-answer', {
      answer: data.answer,
      senderId: socket.userId,
      senderName: socket.userName
    });
  });

  // Handle ICE candidates
  socket.on('webrtc-ice-candidate', (data) => {
    console.log(`🧊 ICE candidate from ${socket.userName} to ${data.targetUserId}`);
    
    // Forward ICE candidate to target user
    socket.to(data.targetUserId).emit('webrtc-ice-candidate', {
      candidate: data.candidate,
      senderId: socket.userId
    });
  });

  // Handle call end
  socket.on('webrtc-end-call', (data) => {
    console.log(`📞 Call ended by ${socket.userName}`);
    
    // Notify target user
    socket.to(data.targetUserId).emit('webrtc-end-call', {
      senderId: socket.userId,
      senderName: socket.userName
    });
  });

  // Handle call request
  socket.on('webrtc-call-request', (data) => {
    // Standardize: Use responderId as the target user ID
    const targetUserId = data.responderId || data.targetUserId;
    console.log(`📞 Call request from ${socket.userName} to ${targetUserId}`);
    
    // Check if target user is online
    const targetConnection = activeConnections.get(targetUserId);
    
    if (targetConnection) {
      // Forward call request to target user
      socket.to(targetUserId).emit('webrtc-call-request', {
        callerId: socket.userId,
        callerName: socket.userName,
        callType: data.callType || 'video', // 'video' or 'audio'
        roomId: data.roomId // Include roomId for call management
      });
    } else {
      // Target user is offline
      socket.emit('webrtc-call-error', {
        error: 'User is offline',
        targetUserId: targetUserId
      });
    }
  });

  // Handle call response
  socket.on('webrtc-call-response', (data) => {
    console.log(`📞 Call response from ${socket.userName}: ${data.accepted ? 'accepted' : 'rejected'}`);
    
    // Forward response to caller
    socket.to(data.callerId).emit('webrtc-call-response', {
      accepted: data.accepted,
      responderId: socket.userId,
      responderName: socket.userName,
      reason: data.reason
    });
  });

  // Handle user status updates
  socket.on('user-status-update', (data) => {
    console.log(`📊 Status update from ${socket.userName}: ${data.status}`);
    
    // Update user status
    const connection = activeConnections.get(socket.userId);
    if (connection) {
      connection.status = data.status;
      connection.lastSeen = new Date();
    }
    
    // Broadcast status to all connected users
    socket.broadcast.emit('user-status-changed', {
      userId: socket.userId,
      userName: socket.userName,
      status: data.status,
      lastSeen: new Date()
    });
  });

  // Handle get online users
  socket.on('get-online-users', () => {
    const onlineUsers = Array.from(activeConnections.values()).map(conn => ({
      userId: conn.userId,
      userName: conn.userName,
      connectedAt: conn.connectedAt,
      status: conn.status || 'online'
    }));
    
    socket.emit('online-users-list', onlineUsers);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userName} (${socket.userId})`);
    
    // Remove from active connections
    activeConnections.delete(socket.userId);
    
    // Notify other users
    socket.broadcast.emit('user-disconnected', {
      userId: socket.userId,
      userName: socket.userName
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.userName}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'WebRTC Signaling Server',
    activeConnections: activeConnections.size,
    timestamp: new Date().toISOString()
  });
});

// Get online users endpoint
app.get('/api/online-users', (req, res) => {
  const onlineUsers = Array.from(activeConnections.values()).map(conn => ({
    userId: conn.userId,
    userName: conn.userName,
    connectedAt: conn.connectedAt,
    status: conn.status || 'online'
  }));
  
  res.json({
    success: true,
    users: onlineUsers,
    count: onlineUsers.length
  });
});

// Start server
server.listen(PORT, () => {
  console.log('\n🚀 ===========================================');
  console.log('📞 WebRTC Signaling Server Started!');
  console.log('🚀 ===========================================');
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Online users: http://localhost:${PORT}/api/online-users`);
  console.log('✅ Ready for WebRTC connections!');
  console.log('===========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

export default app;
