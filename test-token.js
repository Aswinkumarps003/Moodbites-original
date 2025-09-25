// Simple test to verify token generation
const fetch = require('node-fetch');

async function testTokenGeneration() {
  try {
    console.log('Testing token generation...');
    
    const response = await fetch('http://localhost:5006/api/getToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: 'test-room-123',
        participantName: 'test-user',
        participantRole: 'user'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.token && typeof data.token === 'string' && data.token.length > 0) {
      console.log('✅ Token generated successfully!');
      console.log('Token length:', data.token.length);
      console.log('Token preview:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ Token generation failed');
      console.log('Token value:', data.token);
      console.log('Token type:', typeof data.token);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTokenGeneration();
