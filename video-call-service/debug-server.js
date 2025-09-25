// Debug server to test token generation
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

// LiveKit credentials
const LIVEKIT_API_KEY = "APIu6mDeZQKW7C5";
const LIVEKIT_API_SECRET = "80y92tSB4VytbGeH2TpL6nlhYSDN2vQMUBGyfHxcyxh";

console.log('🔑 API Key:', LIVEKIT_API_KEY);
console.log('🔐 API Secret length:', LIVEKIT_API_SECRET.length);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Debug Video Call Service' });
});

app.post('/api/getToken', async (req, res) => {
  try {
    console.log('📝 Received request:', req.body);
    
    const { roomName, participantName, participantRole = 'user' } = req.body;

    if (!roomName || !participantName) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`📝 Generating token for: ${participantName} in room: ${roomName} as ${participantRole}`);

    // Test token generation step by step
    console.log('🔑 Creating AccessToken...');
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantName,
      name: participantName,
    });
    console.log('✅ AccessToken created');

    console.log('🔑 Adding grants...');
    const grants = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };

    if (participantRole === 'dietician') {
      grants.roomAdmin = true;
      grants.canPublishData = true;
    }

    at.addGrant(grants);
    at.ttl = 3600;
    console.log('✅ Grants added');

    console.log('🔑 Generating JWT...');
    const tokenJwt = await at.toJwt();
    console.log('✅ JWT generated');
    console.log('📏 Token length:', tokenJwt ? tokenJwt.length : 0);
    console.log('🔍 Token preview:', tokenJwt ? tokenJwt.substring(0, 50) + '...' : 'NULL');

    res.json({
      token: tokenJwt,
      roomName,
      participantName,
      participantRole,
      expiresIn: 3600,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate token',
      details: error.message,
      stack: error.stack
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎥 Debug Video Call Service running on port ${PORT}`);
});
