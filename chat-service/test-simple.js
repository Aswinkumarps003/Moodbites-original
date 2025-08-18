// Simple test for chatbot service
import fetch from 'node-fetch';

async function testChatbot() {
  console.log("🤖 Testing MoodBites Chatbot Service...");
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3002/health');
    if (healthResponse.ok) {
      console.log("✅ Health check passed");
    } else {
      console.log("❌ Health check failed");
      return;
    }
    
    // Test complete flow
    console.log("💬 Testing complete flow...");
    const response = await fetch('http://localhost:3002/api/complete-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: "I'm feeling sad today"
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Chatbot test successful!");
      console.log(`🎭 Detected mood: ${result.detectedMood}`);
      console.log(`🍽️ Recipes found: ${result.recipes.length}`);
      console.log(`🤖 AI Response: ${result.chatbotReply.substring(0, 100)}...`);
    } else {
      console.log("❌ Chatbot test failed:", response.status);
    }
    
  } catch (error) {
    console.log("❌ Test error:", error.message);
  }
}

testChatbot();
