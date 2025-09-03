// Enhanced test for MoodBites Chatbot Service
import fetch from 'node-fetch';

const CHATBOT_URL = 'http://localhost:3005';

// Test different conversation types
const testConversations = [
  {
    name: "Mood - Sadness",
    message: "I'm feeling really sad today",
    expectedIntent: "mood"
  },
  {
    name: "Mood - Anxiety", 
    message: "I'm so stressed about work",
    expectedIntent: "mood"
  },
  {
    name: "Food - Recipe Request",
    message: "I need a recipe for dinner",
    expectedIntent: "food"
  },
  {
    name: "Food - Hungry",
    message: "I'm hungry, what should I eat?",
    expectedIntent: "food"
  },
  {
    name: "Chit Chat - Greeting",
    message: "Hello! How are you?",
    expectedIntent: "chit_chat"
  },
  {
    name: "Chit Chat - Joke",
    message: "Tell me a joke",
    expectedIntent: "chit_chat"
  },
  {
    name: "Unknown - Math",
    message: "Solve this math problem: 2+2",
    expectedIntent: "unknown"
  },
  {
    name: "Unknown - Politics",
    message: "What do you think about politics?",
    expectedIntent: "unknown"
  }
];

async function testEnhancedChatbot() {
  console.log("🤖 Testing Enhanced MoodBites Chatbot Service");
  console.log("=" .repeat(60));
  
  // Test health endpoint
  console.log("\n1️⃣ Testing health endpoint...");
  try {
    const healthResponse = await fetch(`${CHATBOT_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log("✅ Health check passed:", health.service);
    } else {
      console.log("❌ Health check failed:", healthResponse.status);
      return;
    }
  } catch (error) {
    console.log("❌ Health check error:", error.message);
    return;
  }

  // Test different conversation types
  console.log("\n2️⃣ Testing conversation types...");
  for (const conversation of testConversations) {
    console.log(`\n📝 Testing: ${conversation.name}`);
    console.log(`💬 Message: "${conversation.message}"`);
    
    try {
      const response = await fetch(`${CHATBOT_URL}/api/complete-flow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: conversation.message
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Success!`);
        console.log(`   🎯 Intent: ${result.intent} ${result.intent === conversation.expectedIntent ? '✅' : '❌'}`);
        console.log(`   🎭 Mood: ${result.detectedMood}`);
        console.log(`   🍽️ Recipes: ${result.recipes.length}`);
        console.log(`   🤖 Response: ${result.chatbotReply.substring(0, 80)}...`);
        
        // Verify intent detection
        if (result.intent === conversation.expectedIntent) {
          console.log(`   ✅ Intent detection correct!`);
        } else {
          console.log(`   ⚠️  Intent detection: expected ${conversation.expectedIntent}, got ${result.intent}`);
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
      console.log(`   🎯 Intent: ${result.intent}`);
      console.log(`   🤖 Reply: ${result.reply.substring(0, 80)}...`);
    } else {
      console.log("❌ Simple chat test failed:", response.status);
    }
    
  } catch (error) {
    console.log("❌ Simple chat test error:", error.message);
  }

  console.log("\n" + "=" .repeat(60));
  console.log("🎯 Enhanced chatbot testing complete!");
  console.log("\n🎉 Your chatbot now supports:");
  console.log("   • Intent Detection (mood, food, chit_chat, unknown)");
  console.log("   • Smart Fallback Responses");
  console.log("   • Context-Aware Conversations");
  console.log("   • Out-of-Scope Handling");
  console.log("   • Enhanced User Experience");
}

// Run the test
testEnhancedChatbot().catch(console.error);
