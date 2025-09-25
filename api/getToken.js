// File: /api/getToken.js
// Secure token generation endpoint for LiveKit video calls

import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomName, participantName, participantRole = 'user' } = req.body;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'Missing "roomName" or "participantName"' });
  }

  // Your credentials are read securely from environment variables
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error('LiveKit credentials not found in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
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

    const token = at.toJwt();

    res.status(200).json({ 
      token,
      roomName,
      participantName,
      participantRole 
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
