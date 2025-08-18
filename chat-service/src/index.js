// index.js - MoodBites Chatbot Service with OpenAI integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'MoodBites Chatbot Service',
    timestamp: new Date().toISOString()
  });
});

// Main chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, mood, recipes = [] } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'User message is required' 
      });
    }

    console.log(`💬 Chat request - Mood: ${mood}, Message: "${userMessage}"`);
    console.log(`🍽️ Recipes available: ${recipes.length}`);

    // Generate chatbot response using OpenAI
    const chatbotResponse = await generateChatbotResponse(userMessage, mood, recipes);
    
    res.json({
      success: true,
      reply: chatbotResponse,
      mood: mood,
      recipes: recipes,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in chatbot:', error);
    res.status(500).json({ 
      error: 'Failed to generate chatbot response',
      message: error.message 
    });
  }
});

// Complete mood-to-recipe-to-chat flow
app.post('/api/complete-flow', async (req, res) => {
  try {
    const { userMessage } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'User message is required' 
      });
    }

    console.log(`🔄 Complete flow request: "${userMessage}"`);

    // Step 1: Detect mood using your existing service
    const moodResult = await detectMood(userMessage);
    const detectedMood = moodResult.mood;
    
    console.log(`🎭 Detected mood: ${detectedMood}`);

    // Step 2: Get recipes based on mood
    const recipeResult = await getRecipesByMood(detectedMood);
    const recipes = recipeResult.recipes || [];
    
    console.log(`🍽️ Found ${recipes.length} recipes`);

    // Step 3: Generate chatbot response
    const chatbotResponse = await generateChatbotResponse(userMessage, detectedMood, recipes);
    
    res.json({
      success: true,
      userMessage: userMessage,
      detectedMood: detectedMood,
      moodDescription: moodResult.moodDescription,
      recipes: recipes,
      chatbotReply: chatbotResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in complete flow:', error);
    res.status(500).json({ 
      error: 'Failed to complete the flow',
      message: error.message 
    });
  }
});

// Generate chatbot response using OpenAI
async function generateChatbotResponse(userMessage, mood, recipes) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OPENAI_API_KEY not set. Using fallback response.");
      return generateFallbackResponse(userMessage, mood, recipes);
    }

    // Format recipes for the prompt
    const recipeText = recipes.length > 0 
      ? recipes.map((r, i) => `${i + 1}. **${r.name}** - ${r.moodBenefit || 'Delicious and mood-lifting'}`).join('\n')
      : "No specific recipes available right now, but I can suggest some general mood-appropriate foods.";

    // Create the prompt for OpenAI
    const prompt = `You are MoodBites, a friendly, empathetic food and wellness assistant. Your role is to help users feel better through food recommendations and emotional support.

User's current mood: ${mood || 'unknown'}
User's message: "${userMessage}"

Available food recommendations:
${recipeText}

Instructions:
1. Respond in a warm, supportive, and conversational tone
2. Acknowledge their feelings with empathy
3. Naturally mention 1-2 specific recipes from the list above
4. Explain why these foods might help with their current mood
5. Keep your response under 150 words
6. End with a gentle question to encourage further conversation

Remember: You're not just a food bot - you're a caring friend who understands the connection between food and emotions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective
      messages: [
        {
          role: "system",
          content: "You are MoodBites, a caring food and wellness assistant. Always be empathetic, supportive, and helpful."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    console.log(`🤖 OpenAI response generated: ${response.length} characters`);
    
    return response;

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    console.log("🔄 Falling back to fallback response...");
    return generateFallbackResponse(userMessage, mood, recipes);
  }
}

// Fallback response when OpenAI is not available
function generateFallbackResponse(userMessage, mood, recipes) {
  const moodResponses = {
    joy: "I'm so glad you're feeling joyful! 🎉 When you're happy, it's perfect to enjoy colorful, celebratory foods that match your energy.",
    sadness: "I hear you, and it's okay to feel this way. 💙 Comfort foods can be like a warm hug for your soul. Let me suggest some gentle, nourishing options.",
    anger: "I understand you're feeling frustrated. 🔥 Sometimes spicy or cooling foods can help release that tension and bring you back to center.",
    fear: "Anxiety can be really challenging. 🌸 Gentle, soothing foods might help calm your nerves and bring you some peace.",
    surprise: "Wow, you're feeling excited! ✨ That's wonderful energy to channel into trying new, adventurous flavors.",
    disgust: "I get that feeling. 🌿 Sometimes we need clean, fresh ingredients to reset our palate and mood.",
    neutral: "You seem to be in a balanced state. 🧘‍♀️ This is perfect for enjoying well-rounded, nutritious meals."
  };

  const baseResponse = moodResponses[mood] || "I'm here to help you find the perfect food for your current mood.";
  
  let recipeSuggestion = "";
  if (recipes.length > 0) {
    const selectedRecipes = recipes.slice(0, 2);
    recipeSuggestion = `\n\nI'd recommend trying: ${selectedRecipes.map(r => r.name).join(' or ')}. These are specifically chosen to match how you're feeling right now.`;
  }

  return `${baseResponse}${recipeSuggestion}\n\nHow are you feeling about food right now? Would you like me to suggest something specific?`;
}

// Detect mood using your existing FastAPI service
async function detectMood(text) {
  try {
    const response = await fetch('http://localhost:8000/detect-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });
    
    if (response.ok) {
      const result = await response.json();
      return {
        mood: result.mood,
        confidence: result.confidence,
        moodDescription: getMoodDescription(result.mood)
      };
    } else {
      throw new Error(`Mood detection failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Mood detection error:', error);
    // Fallback mood detection
    return {
      mood: 'neutral',
      confidence: 0.5,
      moodDescription: 'Feeling balanced and neutral'
    };
  }
}

// Get recipes using your existing Express service
async function getRecipesByMood(mood) {
  try {
    const response = await fetch('http://localhost:3001/api/recipes/mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: mood,
        preferences: { number: 4 }
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`Recipe fetch failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Recipe fetch error:', error);
    return { recipes: [] };
  }
}

// Get mood description
function getMoodDescription(mood) {
  const descriptions = {
    joy: "Feeling happy and energetic - perfect for sweet treats and celebration food!",
    sadness: "Feeling down - comfort food and warm dishes to lift your spirits",
    anger: "Feeling frustrated - spicy and fiery dishes to match your energy",
    fear: "Feeling anxious - soothing and gentle flavors to calm your nerves",
    surprise: "Feeling excited - adventurous and fusion cuisine for your enthusiasm",
    disgust: "Feeling turned off - light and fresh ingredients to reset your palate",
    neutral: "Feeling balanced - classic and everyday dishes for your calm state"
  };
  
  return descriptions[mood] || "Feeling neutral - balanced meals for your current state";
}

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const testResponse = await generateChatbotResponse(
      "I'm feeling a bit down today",
      "sadness",
      [
        {
          name: "Warm Chicken Soup",
          moodBenefit: "Comforting and warming, perfect for lifting spirits"
        },
        {
          name: "Chocolate Chip Cookies",
          moodBenefit: "Sweet comfort food that boosts serotonin"
        }
      ]
    );
    
    res.json({
      success: true,
      testMessage: "I'm feeling a bit down today",
      testMood: "sadness",
      chatbotResponse: testResponse
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Test failed', message: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MoodBites Chatbot Service',
    endpoints: {
      health: '/health',
      chat: '/api/chat (POST)',
      completeFlow: '/api/complete-flow (POST)',
      test: '/api/test'
    },
    usage: {
      chat: {
        post: '/api/chat',
        body: {
          userMessage: 'string',
          mood: 'string (optional)',
          recipes: 'array (optional)'
        }
      },
      completeFlow: {
        post: '/api/complete-flow',
        body: {
          userMessage: 'string'
        }
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 MoodBites Chatbot Service running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔄 Complete flow: http://localhost:${PORT}/api/complete-flow`);
  console.log(`📱 Frontend can connect from: http://localhost:5173 or http://localhost:3000`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.log(`⚠️  OPENAI_API_KEY not set - using fallback responses`);
    console.log(`🔑 Get your API key from: https://platform.openai.com/api-keys`);
  } else {
    console.log(`✅ OpenAI API key configured`);
  }
});

export default app; 