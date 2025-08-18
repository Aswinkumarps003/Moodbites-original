// testChatbot.js - Test script for MoodBites Chatbot Service
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CHATBOT_URL = 'http://localhost:3002';

// Test scenarios
const testScenarios = [
  {
    name: "Sadness Test",
    message: "I'm feeling really down today and don't want to eat much",
    expectedMood: "sadness"
  },
  {
    name: "Anxiety Test", 
    message: "I'm so stressed about work, my stomach is in knots",
    expectedMood: "fear"
  },
  {
    name: "Joy Test",
    message: "I'm feeling amazing today! Everything is going great!",
    expectedMood: "joy"
  },
  {
    name: "Anger Test",
    message: "I'm so frustrated with everything right now",
    expectedMood: "anger"
  }
];

async function testChatbotService() {
  console.log("🤖 Testing MoodBites Chatbot Service");
  console.log("=" .repeat(50));
  
  // Test health endpoint
  console.log("\n1️⃣ Testing health endpoint...");
  try {
    const healthResponse = await fetch(`${CHATBOT_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log("✅ Health check passed:", health.status);
    } else {
      console.log("❌ Health check failed:", healthResponse.status);
    }
  } catch (error) {
    console.log("❌ Health check error:", error.message);
  }

  // Test complete flow endpoint
  console.log("\n2️⃣ Testing complete flow endpoint...");
  for (const scenario of testScenarios) {
    console.log(`\n📝 Testing: ${scenario.name}`);
    console.log(`💬 Message: "${scenario.message}"`);
    
    try {
      const response = await fetch(`${CHATBOT_URL}/api/complete-flow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: scenario.message
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Success!`);
        console.log(`   🎭 Detected mood: ${result.detectedMood}`);
        console.log(`   🍽️ Recipes found: ${result.recipes.length}`);
        console.log(`   🤖 Chatbot reply: ${result.chatbotReply.substring(0, 100)}...`);
        
        // Verify mood detection
        if (result.detectedMood === scenario.expectedMood) {
          console.log(`   ✅ Mood detection correct!`);
        } else {
          console.log(`   ⚠️  Mood detection: expected ${scenario.expectedMood}, got ${result.detectedMood}`);
        }
        
      } else {
        const error = await response.json();
        console.log(`❌ Failed:`, error.message || response.statusText);
      }
      
    } catch (error) {
      console.log(`❌ Error:`, error.message);
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test simple chat endpoint
  console.log("\n3️⃣ Testing simple chat endpoint...");
  try {
    const response = await fetch(`${CHATBOT_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: "I need something comforting to eat",
        mood: "sadness",
        recipes: [
          {
            name: "Warm Chicken Soup",
            moodBenefit: "Comforting and warming, perfect for lifting spirits"
          }
        ]
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Simple chat test passed!");
      console.log(`   🤖 Reply: ${result.reply.substring(0, 100)}...`);
    } else {
      console.log("❌ Simple chat test failed:", response.status);
    }
    
  } catch (error) {
    console.log("❌ Simple chat test error:", error.message);
  }

  console.log("\n" + "=" .repeat(50));
  console.log("🎯 Chatbot service testing complete!");
}

// Test API key configuration
function checkConfiguration() {
  console.log("🔧 Configuration Check");
  console.log("=" .repeat(30));
  
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    console.log(`✅ OpenAI API key: ${openaiKey.substring(0, 8)}...`);
  } else {
    console.log("⚠️  OPENAI_API_KEY not set");
    console.log("   The service will use fallback responses");
  }
  
  console.log(`🌐 Chatbot service URL: ${CHATBOT_URL}`);
  console.log(`📊 Expected services:`);
  console.log(`   - Mood Detection: http://localhost:8000`);
  console.log(`   - Recipe Service: http://localhost:3001`);
  console.log(`   - Chatbot Service: ${CHATBOT_URL}`);
}

// Run tests
async function main() {
  checkConfiguration();
  
  console.log("\n🚀 Starting tests in 3 seconds...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    await testChatbotService();
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testChatbotService, checkConfiguration };
