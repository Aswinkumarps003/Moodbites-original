// Test script for video call API
const fetch = require('node-fetch');

async function testVideoCallAPI() {
  try {
    console.log('Testing video call API...');
    
    const response = await fetch('http://localhost:5006/health');
    const health = await response.json();
    console.log('Health check:', health);
    
    const tokenResponse = await fetch('http://localhost:5006/api/getToken', {
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
    
    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);
    
    if (tokenData.token) {
      console.log('✅ Token generated successfully!');
      console.log('Token length:', tokenData.token.length);
    } else {
      console.log('❌ Token generation failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testVideoCallAPI();
