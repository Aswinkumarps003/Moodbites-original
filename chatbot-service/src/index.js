// index.js - Enhanced MoodBites Chatbot Service with Gemini AI integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// Initialize Gemini AI only if API key is available
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API key configured');
  } catch (error) {
    console.log('⚠️ Gemini import failed, using fallback responses');
  }
} else {
  console.log('⚠️ GEMINI_API_KEY not set - using fallback responses');
}

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
    service: 'MoodBites Enhanced Chatbot Service (Gemini AI)',
    timestamp: new Date().toISOString()
  });
});

// Enhanced intent detection using Gemini AI
async function detectIntent(userMessage) {
  try {
    if (!gemini) {
      // Fallback intent detection
      return fallbackIntentDetection(userMessage);
    }

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an intent classifier for a food & mood assistant. 
    Your task is to label the user input as one of:
    - "mood" (if the user talks about emotions, feelings, stress, anxiety, happiness, sadness, etc.)
    - "food" (if the user directly asks about food, recipes, cooking, or diet)
    - "chit_chat" (if it is general conversation like greetings, jokes, or casual talk)
    - "unknown" (if it is irrelevant to mood/food or outside context)
    
    Return ONLY the label, nothing else.`;

    const result = await model.generateContent([
      systemPrompt,
      userMessage
    ]);
    
    const intent = result.response.text().trim().toLowerCase();
    console.log(`🎯 Detected intent: ${intent}`);
    return intent;

  } catch (error) {
    console.error('❌ Intent detection error:', error);
    return fallbackIntentDetection(userMessage);
  }
}

// Fallback intent detection
function fallbackIntentDetection(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Mood keywords
  const moodKeywords = ['sad', 'happy', 'anxious', 'stressed', 'worried', 'excited', 'angry', 'frustrated', 'depressed', 'lonely', 'nervous', 'calm', 'peaceful', 'energetic', 'tired', 'exhausted'];
  
  // Food keywords
  const foodKeywords = ['recipe', 'cook', 'food', 'meal', 'dish', 'ingredient', 'kitchen', 'chef', 'dinner', 'lunch', 'breakfast', 'snack', 'hungry', 'eat', 'diet'];
  
  // Chit-chat keywords
  const chitChatKeywords = ['hello', 'hi', 'hey', 'how are you', 'good morning', 'good evening', 'joke', 'funny', 'thanks', 'thank you', 'bye', 'goodbye'];
  
  if (moodKeywords.some(keyword => message.includes(keyword))) {
    return 'mood';
  } else if (foodKeywords.some(keyword => message.includes(keyword))) {
    return 'food';
  } else if (chitChatKeywords.some(keyword => message.includes(keyword))) {
    return 'chit_chat';
  } else {
    return 'unknown';
  }
}

// Enhanced chatbot response generation using Gemini AI
async function generateEnhancedResponse(userMessage, intent, recipes = []) {
  try {
    if (!gemini) {
      return generateFallbackResponse(userMessage, intent, recipes);
    }

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemPrompt = '';
    let userContent = userMessage;

    switch (intent) {
      case 'unknown':
        return "Sorry 😅 I can't help with that. But I can suggest food based on how you feel! What's on your mind?";
      
      case 'mood':
        systemPrompt = `You are a friendly, empathetic food & mood assistant. The user is sharing their emotional state.
        - Acknowledge their feelings with empathy
        - Suggest 1-2 specific foods that might help with their mood
        - Be warm, supportive, and conversational
        - Use emojis naturally
        - Keep response under 100 words
        - End with a gentle question to encourage conversation`;
        
        if (recipes.length > 0) {
          userContent += `\n\nHere are some recipe suggestions: ${recipes.map(r => r.name).join(', ')}`;
        }
        break;
      
      case 'food':
        systemPrompt = `You are a helpful food assistant. The user is asking about food, recipes, or cooking.
        - Provide helpful food advice or recipe suggestions
        - Be enthusiastic about food and cooking
        - Use food-related emojis naturally
        - Keep response under 100 words
        - End with a question about their food preferences`;
        
        if (recipes.length > 0) {
          userContent += `\n\nHere are some recipes: ${recipes.map(r => r.name).join(', ')}`;
        }
        break;
      
      case 'chit_chat':
        systemPrompt = `You are a friendly food & mood assistant having a casual conversation.
        - Respond naturally like a caring friend
        - Use emojis to show personality
        - Keep it light and engaging
        - Gently guide conversation toward food/mood topics
        - Keep response under 80 words`;
        break;
      
      default:
        systemPrompt = `You are a friendly food & mood assistant. Be helpful, warm, and conversational.`;
    }

    const result = await model.generateContent([
      systemPrompt,
      userContent
    ]);

    const reply = result.response.text().trim();
    console.log(`🤖 Generated response: ${reply.substring(0, 50)}...`);
    return reply;

  } catch (error) {
    console.error('❌ Gemini AI response generation error:', error);
    return generateFallbackResponse(userMessage, intent, recipes);
  }
}

// Enhanced main chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, mood, recipes = [] } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'User message is required' 
      });
    }

    console.log(`💬 Chat request: "${userMessage}"`);

    // Step 1: Detect intent
    const intent = await detectIntent(userMessage);
    console.log(`🎯 Intent: ${intent}`);

    // Step 2: Generate response based on intent
    const chatbotResponse = await generateEnhancedResponse(userMessage, intent, recipes);
    
    res.json({
      success: true,
      reply: chatbotResponse,
      intent: intent,
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

// Enhanced complete flow endpoint
app.post('/api/complete-flow', async (req, res) => {
  try {
    const { userMessage } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'User message is required' 
      });
    }

    console.log(`🔄 Complete flow request: "${userMessage}"`);

    // Step 1: Detect intent
    const intent = await detectIntent(userMessage);
    console.log(`🎯 Intent: ${intent}`);

    // Step 2: Detect mood (only for mood-related intents)
    let detectedMood = 'neutral';
    let moodDescription = 'Feeling balanced';
    
    if (intent === 'mood') {
      try {
        const moodResult = await detectMood(userMessage);
        detectedMood = moodResult.mood;
        moodDescription = moodResult.moodDescription;
        console.log(`🎭 Detected mood: ${detectedMood}`);
      } catch (error) {
        console.log('⚠️ Mood detection failed, using neutral');
      }
    }

    // Step 3: Get recipes (only for mood/food intents)
    let recipes = [];
    if (intent === 'mood' || intent === 'food') {
      try {
        const recipeResult = await getRecipesByMood(detectedMood);
        recipes = recipeResult.recipes || [];
        console.log(`🍽️ Found ${recipes.length} recipes`);
      } catch (error) {
        console.log('⚠️ Recipe fetch failed, using empty recipes');
      }
    }

    // Step 4: Generate enhanced chatbot response
    const chatbotResponse = await generateEnhancedResponse(userMessage, intent, recipes);
    
    res.json({
      success: true,
      userMessage: userMessage,
      intent: intent,
      detectedMood: detectedMood,
      moodDescription: moodDescription,
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
    if (!gemini) {
      console.log("⚠️ Gemini not initialized. Using fallback response.");
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

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      prompt
    ]);

    const response = result.response.text().trim();
    console.log(`🤖 Gemini response generated: ${response.length} characters`);
    
    return response;

  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.log("🔄 Falling back to fallback response...");
    return generateFallbackResponse(userMessage, mood, recipes);
  }
}

// Enhanced fallback response when OpenAI is not available
function generateFallbackResponse(userMessage, intent, recipes) {
  const message = userMessage.toLowerCase();
  
  switch (intent) {
    case 'unknown':
      return "Sorry 😅 I can't help with that. But I can suggest food based on how you feel! What's on your mind?";
    
    case 'mood':
      if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
        return "I hear you're feeling down. 💙 Comfort foods like warm soup, chocolate, or a hearty pasta dish might help lift your spirits. What sounds appealing?";
      } else if (message.includes('happy') || message.includes('joy') || message.includes('excited')) {
        return "That's wonderful! ✨ When you're feeling great, try colorful, vibrant foods like fresh salads, smoothie bowls, or fun desserts to match your energy!";
      } else if (message.includes('stressed') || message.includes('anxious') || message.includes('worried')) {
        return "Stress can be challenging. 🌸 Soothing foods like chamomile tea, warm oatmeal, or gentle soups might help calm your nerves. Would you like some suggestions?";
      } else if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
        return "I understand you're feeling frustrated. 🔥 Sometimes spicy foods or cooling smoothies can help release that energy. What sounds good to you?";
      } else {
        return "I'm here to help you find the perfect food for your mood! 🍽️ How are you feeling today?";
      }
    
    case 'food':
      if (message.includes('recipe') || message.includes('cook')) {
        return "I'd love to help you with recipes! 👨‍🍳 What type of food are you in the mood for? Sweet, savory, quick meals, or something special?";
      } else if (message.includes('hungry') || message.includes('eat')) {
        return "Hunger is calling! 🍕 What sounds good right now? I can suggest quick meals, healthy options, or comfort food!";
      } else {
        return "Food is always a great topic! 🍽️ Are you looking for recipes, meal ideas, or cooking tips?";
      }
    
    case 'chit_chat':
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hey there! 👋 How are you feeling today? I'm here to help you find the perfect food for your mood!";
      } else if (message.includes('joke') || message.includes('funny')) {
        return "😄 Why don't eggs tell jokes? They'd crack each other up! But seriously, how are you feeling? I'd love to suggest some mood-lifting food!";
      } else if (message.includes('thanks') || message.includes('thank you')) {
        return "You're welcome! 😊 I'm here whenever you need food suggestions or just want to chat about how you're feeling!";
      } else {
        return "Nice chatting with you! 😊 How are you feeling today? I'd love to suggest some food that matches your mood!";
      }
    
    default:
      return "I'm here to help you find the perfect food for your mood! 🍽️ How are you feeling today?";
  }
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
  
  if (!process.env.GEMINI_API_KEY) {
    console.log(`⚠️  GEMINI_API_KEY not set - using fallback responses`);
    console.log(`🔑 Get your API key from: https://makersuite.google.com/app/apikey`);
  } else {
    console.log(`✅ Gemini API key configured`);
  }
});

export default app; 