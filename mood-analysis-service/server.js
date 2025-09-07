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

// ==================== COMPREHENSIVE RECIPE ENDPOINTS ====================

// Get comprehensive recipes by mood (enhanced with multiple strategies)
app.post('/api/recipes/mood', async (req, res) => {
  try {
    const { mood, preferences = {} } = req.body;
    
    if (!mood) {
      return res.status(400).json({ 
        error: 'Mood parameter is required' 
      });
    }

    console.log(`🎭 Comprehensive recipe request for mood: ${mood}`);
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

// Get detailed recipe information
app.get('/api/recipes/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    console.log(`📋 Fetching detailed recipe: ${id}`);
    
    const details = await recipeService.getRecipeInformation(id);
    
    if (!details) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(details);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details', details: error.message });
  }
});

// Get recipe information bulk
app.post('/api/recipes/bulk', async (req, res) => {
  try {
    const { recipeIds } = req.body;
    
    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ error: 'Array of recipe IDs is required' });
    }

    console.log(`📋 Fetching bulk recipe information for ${recipeIds.length} recipes`);
    
    const recipes = await recipeService.getRecipeInformationBulk(recipeIds);
    
    res.json({ recipes, count: recipes.length });
  } catch (error) {
    console.error('Error fetching bulk recipes:', error);
    res.status(500).json({ error: 'Failed to fetch bulk recipes', details: error.message });
  }
});

// Get similar recipes
app.get('/api/recipes/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    console.log(`🔍 Fetching similar recipes for: ${id}`);
    
    const similar = await recipeService.getSimilarRecipes(id, parseInt(limit));
    
    res.json({ recipeId: id, similar });
  } catch (error) {
    console.error('Error fetching similar recipes:', error);
    res.status(500).json({ error: 'Failed to fetch similar recipes', details: error.message });
  }
});

// Autocomplete recipe search
app.get('/api/recipes/autocomplete', async (req, res) => {
  try {
    const { q: query, number = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`🔍 Autocomplete recipe search: ${query}`);
    
    const results = await recipeService.autocompleteRecipeSearch(query, parseInt(number));
    
    res.json({ query, results });
  } catch (error) {
    console.error('Error in autocomplete search:', error);
    res.status(500).json({ error: 'Failed to autocomplete search', details: error.message });
  }
});

// ==================== INGREDIENT ENDPOINTS ====================

// Search ingredients
app.get('/api/ingredients/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`🔍 Searching ingredients: ${query}`);
    
    const ingredients = await recipeService.searchIngredients(query, parseInt(limit));
    
    res.json({ query, ingredients });
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ error: 'Failed to search ingredients', details: error.message });
  }
});

// Get ingredient information
app.get('/api/ingredients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Ingredient ID is required' });
    }

    console.log(`📋 Fetching ingredient information: ${id}`);
    
    const ingredient = await recipeService.getIngredientInformation(id);
    
    res.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient', details: error.message });
  }
});

// Autocomplete ingredient search
app.get('/api/ingredients/autocomplete', async (req, res) => {
  try {
    const { q: query, number = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`🔍 Autocomplete ingredient search: ${query}`);
    
    const results = await recipeService.autocompleteIngredientSearch(query, parseInt(number));
    
    res.json({ query, results });
  } catch (error) {
    console.error('Error in ingredient autocomplete:', error);
    res.status(500).json({ error: 'Failed to autocomplete ingredients', details: error.message });
  }
});

// Get ingredient substitutes
app.get('/api/ingredients/substitutes/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({ error: 'Ingredient name is required' });
    }

    console.log(`🔄 Finding substitutes for: ${name}`);
    
    const substitutes = await recipeService.getIngredientSubstitutes(name);
    
    res.json(substitutes);
  } catch (error) {
    console.error('Error finding substitutes:', error);
    res.status(500).json({ error: 'Failed to find substitutes', details: error.message });
  }
});

// ==================== MEAL PLANNING ENDPOINTS ====================

// Generate meal plan
app.post('/api/meal-plan', async (req, res) => {
  try {
    const { mood, timeFrame = 'day' } = req.body;
    
    if (!mood) {
      return res.status(400).json({ error: 'Mood parameter is required' });
    }

    console.log(`📅 Generating meal plan for mood: ${mood}`);
    
    const mealPlan = await recipeService.generateMealPlan(mood, timeFrame);
    
    res.json({ mood, timeFrame, mealPlan });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan', details: error.message });
  }
});

// ==================== ANALYSIS ENDPOINTS ====================

// Classify cuisine
app.post('/api/analyze/cuisine', async (req, res) => {
  try {
    const { title, ingredientList } = req.body;
    
    if (!title || !ingredientList) {
      return res.status(400).json({ error: 'Title and ingredient list are required' });
    }

    console.log(`🍽️ Classifying cuisine for: ${title}`);
    
    const classification = await recipeService.classifyCuisine(title, ingredientList);
    
    res.json(classification);
  } catch (error) {
    console.error('Error classifying cuisine:', error);
    res.status(500).json({ error: 'Failed to classify cuisine', details: error.message });
  }
});

// Analyze recipe instructions
app.post('/api/analyze/instructions', async (req, res) => {
  try {
    const { instructions } = req.body;
    
    if (!instructions) {
      return res.status(400).json({ error: 'Instructions are required' });
    }

    console.log(`📝 Analyzing recipe instructions`);
    
    const analysis = await recipeService.analyzeRecipeInstructions(instructions);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing instructions:', error);
    res.status(500).json({ error: 'Failed to analyze instructions', details: error.message });
  }
});

// Guess nutrition by dish name
app.post('/api/analyze/nutrition', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Dish title is required' });
    }

    console.log(`🥗 Guessing nutrition for: ${title}`);
    
    const nutrition = await recipeService.guessNutritionByDishName(title);
    
    res.json({ title, nutrition });
  } catch (error) {
    console.error('Error guessing nutrition:', error);
    res.status(500).json({ error: 'Failed to guess nutrition', details: error.message });
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
    message: 'MoodBites Comprehensive Recipe Service',
    version: '2.0.0',
    description: 'Enhanced Spoonacular API integration with multiple search strategies',
    endpoints: {
      // Core Recipe Endpoints
      health: '/health',
      moodRecipes: 'POST /api/recipes/mood',
      recipeDetails: 'GET /api/recipes/:id/details',
      recipeBulk: 'POST /api/recipes/bulk',
      similarRecipes: 'GET /api/recipes/:id/similar',
      autocompleteRecipes: 'GET /api/recipes/autocomplete',
      
      // Ingredient Endpoints
      searchIngredients: 'GET /api/ingredients/search',
      ingredientInfo: 'GET /api/ingredients/:id',
      autocompleteIngredients: 'GET /api/ingredients/autocomplete',
      ingredientSubstitutes: 'GET /api/ingredients/substitutes/:name',
      
      // Meal Planning
      mealPlan: 'POST /api/meal-plan',
      
      // Analysis Endpoints
      classifyCuisine: 'POST /api/analyze/cuisine',
      analyzeInstructions: 'POST /api/analyze/instructions',
      guessNutrition: 'POST /api/analyze/nutrition',
      
      // Utility Endpoints
      cuisines: 'GET /api/cuisines',
      diets: 'GET /api/diets',
      test: 'GET /api/test/:mood'
    },
    features: [
      'Multiple search strategies per mood (Complex Search, Random Recipes, Find by Ingredients, Search by Nutrients)',
      'Comprehensive recipe information with nutrition data',
      'Ingredient search and substitution suggestions',
      'Meal planning based on mood',
      'Cuisine classification and recipe analysis',
      'Autocomplete for recipes and ingredients',
      'Similar recipe recommendations',
      'Bulk recipe information fetching'
    ],
    usage: {
      moodBasedRecipes: {
        endpoint: 'POST /api/recipes/mood',
        body: {
          mood: 'joy|sadness|anger|fear|surprise|disgust|neutral',
          preferences: {
            cuisine: 'italian',
            diet: 'vegetarian',
            maxReadyTime: 30,
            maxCalories: 500,
            number: 12
          }
        }
      },
      recipeDetails: {
        endpoint: 'GET /api/recipes/:id/details',
        description: 'Get detailed recipe with nutrition, wine pairing, and taste data'
      },
      ingredientSearch: {
        endpoint: 'GET /api/ingredients/search?q=chicken&limit=10',
        description: 'Search for ingredients with detailed information'
      },
      mealPlanning: {
        endpoint: 'POST /api/meal-plan',
        body: {
          mood: 'joy',
          timeFrame: 'day'
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
