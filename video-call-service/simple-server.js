// Simple video call service for testing
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const PORT = 5006;

// Middleware
app.use(cors());
app.use(express.json());

// LiveKit credentials - using the exact values from your screenshot
const LIVEKIT_API_KEY = "APIu6mDeZQKW7C5";
const LIVEKIT_API_SECRET = "80y92tSB4VytbGeH2TpL6nlhYSDN2vQMUBGyfHxcyxh";

console.log('🚀 Starting Video Call Service...');
console.log('🔑 API Key:', LIVEKIT_API_KEY);
console.log('🔐 API Secret length:', LIVEKIT_API_SECRET.length);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Video Call Service',
    timestamp: new Date().toISOString()
  });
});

// Token generation
app.post('/api/getToken', async (req, res) => {
  try {
    const { roomName, participantName, participantRole = 'user' } = req.body;

    console.log(`📝 Generating token for: ${participantName} in room: ${roomName} as ${participantRole}`);

    if (!roomName || !participantName) {
      return res.status(400).json({ 
        error: 'Missing required fields: roomName and participantName' 
      });
    }

    // Create access token
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantName,
      name: participantName,
    });

    // Grant permissions
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
    at.ttl = 3600; // 1 hour

    const tokenJwt = await at.toJwt();
    if (!tokenJwt || typeof tokenJwt !== 'string') {
      console.error('❌ Failed to generate JWT');
      return res.status(500).json({ error: 'Failed to generate JWT' });
    }
    
    console.log('✅ Token generated successfully!');
    console.log('📏 Token length:', tokenJwt.length);

    res.json({
      token: tokenJwt,
      roomName,
      participantName,
      participantRole,
      expiresIn: 3600,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error generating token:', error);
    res.status(500).json({ 
      error: 'Failed to generate access token',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎥 Video Call Service running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🔑 Token: http://localhost:${PORT}/api/getToken`);
});
