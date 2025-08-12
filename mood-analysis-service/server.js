// server.js - Express server to bridge React frontend with recipe service
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import RecipeService from './recipeService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.SPOONACULAR_API_KEY;
const A = process.env.hi;
console.log(API_KEY);
console.log(A);
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize recipe service
const recipeService = new RecipeService();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'MoodBites Recipe Service',
    timestamp: new Date().toISOString()
  });
});

// Get recipes by mood endpoint
app.post('/api/recipes/mood', async (req, res) => {
  try {
    const { mood, preferences = {} } = req.body;
    
    if (!mood) {
      return res.status(400).json({ 
        error: 'Mood parameter is required' 
      });
    }

    console.log(`🎭 Recipe request for mood: ${mood}`);
    console.log(`📋 Preferences:`, preferences);

    const result = await recipeService.getRecipesByMood(mood, preferences);
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error in /api/recipes/mood:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recipes',
      message: error.message 
    });
  }
});

// Get available cuisines
app.get('/api/cuisines', (req, res) => {
  try {
    const cuisines = recipeService.getAvailableCuisines();
    res.json({ cuisines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cuisines' });
  }
});

// Get available diets
app.get('/api/diets', (req, res) => {
  try {
    const diets = recipeService.getAvailableDiets();
    res.json({ diets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get diets' });
  }
});

// Test endpoint with sample mood
app.get('/api/test/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    const result = await recipeService.getRecipesByMood(mood, { number: 3 });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Test failed', message: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MoodBites Recipe Service',
    endpoints: {
      health: '/health',
      recipes: '/api/recipes/mood (POST)',
      cuisines: '/api/cuisines',
      diets: '/api/diets',
      test: '/api/test/:mood'
    },
    usage: {
      post: '/api/recipes/mood',
      body: {
        mood: 'joy|sadness|anger|fear|surprise|disgust|neutral',
        preferences: {
          cuisine: 'italian',
          diet: 'vegetarian',
          maxReadyTime: 30,
          maxCalories: 500,
          number: 6
        }
      }
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MoodBites Recipe Service running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🍽️  Recipe endpoint: http://localhost:${PORT}/api/recipes/mood`);
  console.log(`📱 Frontend can connect from: http://localhost:5173 or http://localhost:3000`);
  
  if (!process.env.SPOONACULAR_API_KEY) {
    console.log(`⚠️  SPOONACULAR_API_KEY not set - using mock data`);
    console.log(`🔑 Get your API key from: https://spoonacular.com/food-api`);
  } else {
    console.log(`✅ Spoonacular API key configured`);
  }
});

export default app;
