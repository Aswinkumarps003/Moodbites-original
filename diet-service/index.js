const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());

// ENV
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

//(using Spoonacular only)

// Connect
mongoose.connect(MONGO_URI).then(() => {
  console.log('diet-service connected to MongoDB');
}).catch(err => {
  console.error('diet-service Mongo error', err);
});

// Models
const dietSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  activity: { type: String, required: true },
  goals: { type: [String], default: [] },
  conditions: { type: [String], default: [] },
  // Global preferences
  dietPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Vegan', 'Eggetarian', null], default: null },
  cuisine: { type: [String], default: [] },
  // Goal specific
  weightLoss: {
    currentWeightKg: { type: Number, default: null },
    targetWeightKg: { type: Number, default: null },
    idealWeightCategory: { type: String, enum: ['Underweight', 'Normal', 'Overweight', 'Obese', null], default: null },
  },
  countCalories: {
    calorieTarget: { type: Number, default: null },
    approach: { type: String, enum: ['Balanced Diet', 'Low Carb', 'Intermittent Fasting', null], default: null },
  },
  muscleGain: {
    proteinTargetGrams: { type: Number, default: null },
    supplements: { type: [String], default: [] },
    workoutType: { type: String, enum: ['Strength Training', 'Bodyweight', 'CrossFit', null], default: null },
  },
  workoutYoga: {
    workoutFrequency: { type: String, enum: ['Daily', '3x per week', 'Custom', null], default: null },
    yogaType: { type: String, enum: ['Hatha', 'Vinyasa', 'Power Yoga', null], default: null },
    dietSupport: { type: String, default: null },
  },
  healthyFoods: {
    healthFocus: { type: String, enum: ['Diabetes-friendly', 'Heart-healthy', 'Low sodium', 'High fiber', null], default: null },
    restrictedFoods: { type: [String], default: [] },
  },
  // Generated plan storage
  generatedPlan: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

const Diet = mongoose.model('Diet', dietSchema);

// Routes
app.post('/api/diet-planner', async (req, res) => {
  try {
    const {
      userId,
      activity,
      goals,
      conditions,
      dietPreference,
      cuisine,
      weightLoss,
      countCalories,
      muscleGain,
      workoutYoga,
      healthyFoods,
    } = req.body;
    if (!userId || !activity) {
      return res.status(400).json({ message: 'userId and activity are required' });
    }

    const dietDoc = await Diet.create({
      userId,
      activity,
      goals,
      conditions,
      dietPreference,
      cuisine,
      weightLoss,
      countCalories,
      muscleGain,
      workoutYoga,
      healthyFoods,
    });
    res.status(201).json({ message: 'Diet plan saved', diet: dietDoc });
  } catch (err) {
    console.error('Create diet error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/diet-planner/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const diets = await Diet.find({ userId }).sort({ createdAt: -1 });
    res.json({ count: diets.length, diets });
  } catch (err) {
    console.error('Fetch diet error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DeepSeek generation endpoint removed

// Helper: fetch recipes from Spoonacular using cuisine + diet filters
async function fetchSpoonacularRecipes(dietDoc) {
  let baseUrl = `https://api.spoonacular.com/recipes/complexSearch?number=5&addRecipeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;

  // Add cuisine filter if available
  if (dietDoc.cuisine && dietDoc.cuisine.length > 0) {
    // Spoonacular expects comma-separated cuisines (e.g., "Indian,Chinese")
    baseUrl += `&cuisine=${encodeURIComponent(dietDoc.cuisine.join(','))}`;
  }

  // Add diet filter if preference is set
  if (dietDoc.dietPreference) {
    // Map to Spoonacular diet types
    const dietMap = {
      'Veg': 'vegetarian',
      'Vegan': 'vegan',
      'Eggetarian': 'vegetarian', // Spoonacular doesn't support separate egg-friendly
      'Non-Veg': '', // no filter
    };
    const spoonDiet = dietMap[dietDoc.dietPreference];
    if (spoonDiet) {
      baseUrl += `&diet=${encodeURIComponent(spoonDiet)}`;
    }
  }

  console.log('Spoonacular URL:', baseUrl);
  const resp = await fetch(baseUrl);
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Spoonacular error ${resp.status}: ${text}`);
  }
  const data = JSON.parse(text);
  return Array.isArray(data.results) ? data.results : [];
}

// Helper: create simple diet plan from Spoonacular recipes
async function createSimpleDietPlan(recipes, dietDoc) {
  // Simple meal assignment based on recipe order
  const meals = ['Breakfast', 'Snack1', 'Lunch', 'Snack2', 'Dinner'];
  const plan = {};
  
  recipes.forEach((recipe, index) => {
    const mealName = meals[index] || 'Dinner';
    plan[mealName] = {
      recipe: recipe.title,
      calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 'N/A',
      ingredients: recipe.nutrition?.ingredients?.map(i => i.name) || []
    };
  });
  
  // Calculate total calories
  const totalCalories = Object.values(plan).reduce((sum, meal) => {
    const calories = typeof meal.calories === 'number' ? meal.calories : 0;
    return sum + calories;
  }, 0);
  
  plan.TotalCalories = `${totalCalories} kcal`;
  
  return plan;
}

// Generate via Spoonacular only
app.post('/api/diet-planner/generate/:userId', async (req, res) => {
  try {
    console.log('Starting diet plan generation for user:', req.params.userId);
    
    if (!SPOONACULAR_API_KEY) {
      console.error('Missing API key:', { SPOONACULAR_API_KEY: !!SPOONACULAR_API_KEY });
      return res.status(400).json({ message: 'Missing SPOONACULAR_API_KEY' });
    }
    
    const { userId } = req.params;
    const dietDoc = await Diet.findOne({ userId }).sort({ createdAt: -1 });
    if (!dietDoc) {
      console.error('No diet doc found for user:', userId);
      return res.status(404).json({ message: 'No diet info found for this user' });
    }

    console.log('Found diet doc:', { activity: dietDoc.activity, goals: dietDoc.goals, cuisine: dietDoc.cuisine, dietPreference: dietDoc.dietPreference });
    
    const recipes = await fetchSpoonacularRecipes(dietDoc);
    console.log('Fetched recipes count:', recipes.length);
    
    if (!recipes.length) {
      return res.status(502).json({ message: 'No recipes found from Spoonacular' });
    }

    console.log('Creating simple diet plan...');
    const plan = await createSimpleDietPlan(recipes, dietDoc);
    console.log('Generated plan:', plan);
    
    dietDoc.generatedPlan = plan;
    await dietDoc.save();
    console.log('Plan saved to database');

    res.json({ success: true, plan });
  } catch (err) {
    console.error('Diet plan generation error:', err);
    res.status(500).json({ message: 'Failed to generate diet plan', error: err.message });
  }
});

app.listen(PORT, () => console.log(`diet-service running on ${PORT}`));


