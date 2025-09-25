// File: /video-call-service/index.js
// Backend service for LiveKit token generation

const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors());
app.use(express.json());

// Your LiveKit credentials - hardcoded for now
const LIVEKIT_API_KEY = "APIu6mDeZQKW7C5";
const LIVEKIT_API_SECRET = "80y92tSB4VytbGeH2TpL6nIhYSDN2vQMUbGYfHxcyxh";

console.log('LiveKit API Key:', LIVEKIT_API_KEY);
console.log('LiveKit API Secret length:', LIVEKIT_API_SECRET ? LIVEKIT_API_SECRET.length : 0);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Video Call Service',
    timestamp: new Date().toISOString()
  });
});

// Token generation endpoint
app.post('/api/getToken', async (req, res) => {
  try {
    const { roomName, participantName, participantRole = 'user' } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({ 
        error: 'Missing required fields: roomName and participantName' 
      });
    }

    console.log(`Generating token for: ${participantName} in room: ${roomName} as ${participantRole}`);

    // Create access token
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantName,
      name: participantName,
    });

    // Grant permissions based on role
    const grants = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };

    // Dieticians get additional permissions
    if (participantRole === 'dietician') {
      grants.roomAdmin = true;
      grants.canPublishData = true;
    }

    at.addGrant(grants);

    // Set token expiration (1 hour)
    at.ttl = 3600;

    const tokenJwt = await at.toJwt();
    if (!tokenJwt || typeof tokenJwt !== 'string') {
      console.error('Failed to create JWT token. Result:', tokenJwt);
      return res.status(500).json({ error: 'Failed to generate JWT token' });
    }
    
    console.log('Generated token:', 'SUCCESS');
    console.log('Token length:', tokenJwt.length);

    res.json({
      token: tokenJwt,
      roomName,
      participantName,
      participantRole,
      expiresIn: 3600,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating token:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate access token',
      details: error.message,
      stack: error.stack
    });
  }
});

// Room management endpoints
app.post('/api/createRoom', async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({ 
        error: 'Missing required fields: roomName and participantName' 
      });
    }

    // Generate a unique room name
    const uniqueRoomName = `${roomName}-${Date.now()}`;

    res.json({
      roomName: uniqueRoomName,
      participantName,
      message: 'Room created successfully'
    });

  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ 
      error: 'Failed to create room',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎥 Video Call Service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/getToken`);
  console.log(`🏠 Room endpoint: http://localhost:${PORT}/api/createRoom`);
});

module.exports = app;
