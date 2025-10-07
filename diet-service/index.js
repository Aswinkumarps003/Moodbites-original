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

// Diet Plan Collection Schema - stores generated diet plans from Spoonacular
const dietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dietId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diet', required: true },
  planName: { type: String, default: 'My Diet Plan' },
  totalCalories: { type: String, required: true },
  meals: [{
    mealType: { type: String, required: true }, // Breakfast, Lunch, Dinner, Snack1, Snack2
    recipe: { type: String, required: true },
    calories: { type: Number, required: true },
    ingredients: [{ type: String }],
    spoonacularId: { type: Number }, // Store Spoonacular recipe ID for future reference
    image: { type: String }, // Recipe image URL
    readyInMinutes: { type: Number }, // Cooking time
    servings: { type: Number, default: 1 },
    nutrition: {
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
      fiber: { type: Number },
      sugar: { type: Number }
    }
  }],
  preferences: {
    dietPreference: { type: String },
    cuisine: [{ type: String }],
    healthConditions: [{ type: String }]
  },
  isActive: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Diet = mongoose.model('Diet', dietSchema);
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

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

// Helper: create detailed diet plan from Spoonacular recipes
async function createDetailedDietPlan(recipes, dietDoc) {
  const meals = ['Breakfast', 'Snack1', 'Lunch', 'Snack2', 'Dinner'];
  const plan = {};
  const mealDetails = [];
  
  recipes.forEach((recipe, index) => {
    const mealName = meals[index] || 'Dinner';
    
    // Extract nutrition data
    const nutrition = recipe.nutrition?.nutrients || [];
    const calories = nutrition.find(n => n.name === 'Calories')?.amount || 0;
    const protein = nutrition.find(n => n.name === 'Protein')?.amount || 0;
    const carbs = nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0;
    const fat = nutrition.find(n => n.name === 'Fat')?.amount || 0;
    const fiber = nutrition.find(n => n.name === 'Fiber')?.amount || 0;
    const sugar = nutrition.find(n => n.name === 'Sugar')?.amount || 0;
    
    // Create meal object for database storage
    const mealData = {
      mealType: mealName,
      recipe: recipe.title,
      calories: Math.round(calories),
      ingredients: recipe.nutrition?.ingredients?.map(i => i.name) || [],
      spoonacularId: recipe.id,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 30,
      servings: recipe.servings || 1,
      nutrition: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        fiber: Math.round(fiber),
        sugar: Math.round(sugar)
      }
    };
    
    mealDetails.push(mealData);
    
    // Also create the simple format for backward compatibility
    plan[mealName] = {
      recipe: recipe.title,
      calories: Math.round(calories),
      ingredients: recipe.nutrition?.ingredients?.map(i => i.name) || []
    };
  });
  
  // Calculate total calories
  const totalCalories = mealDetails.reduce((sum, meal) => sum + meal.calories, 0);
  plan.TotalCalories = `${totalCalories} kcal`;
  
  return { plan, mealDetails, totalCalories };
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

    console.log('Creating detailed diet plan...');
    const { plan, mealDetails, totalCalories } = await createDetailedDietPlan(recipes, dietDoc);
    console.log('Generated plan:', plan);
    
    // Save to DietPlan collection
    const dietPlan = new DietPlan({
      userId: userId,
      dietId: dietDoc._id,
      planName: `Diet Plan - ${new Date().toLocaleDateString()}`,
      totalCalories: `${totalCalories} kcal`,
      meals: mealDetails,
      preferences: {
        dietPreference: dietDoc.dietPreference,
        cuisine: dietDoc.cuisine,
        healthConditions: dietDoc.conditions
      },
      isActive: true,
      generatedAt: new Date()
    });
    
    await dietPlan.save();
    console.log('Diet plan saved to DietPlan collection');
    
    // Also update the original Diet document for backward compatibility
    dietDoc.generatedPlan = plan;
    await dietDoc.save();
    console.log('Plan also saved to Diet collection for backward compatibility');

    res.json({ 
      success: true, 
      plan,
      dietPlanId: dietPlan._id,
      message: 'Diet plan generated and saved successfully'
    });
  } catch (err) {
    console.error('Diet plan generation error:', err);
    res.status(500).json({ message: 'Failed to generate diet plan', error: err.message });
  }
});

// Get all diet plans for a user
app.get('/api/diet-plans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const dietPlans = await DietPlan.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .populate('dietId', 'activity goals dietPreference cuisine');
    
    res.json({ 
      success: true, 
      count: dietPlans.length, 
      dietPlans 
    });
  } catch (err) {
    console.error('Fetch diet plans error:', err);
    res.status(500).json({ message: 'Failed to fetch diet plans', error: err.message });
  }
});

// Admin: Get all active diet plans (with diet meta), paginated
app.get('/api/diet-plans', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = (page - 1) * limit;

    const [total, dietPlans] = await Promise.all([
      DietPlan.countDocuments({ isActive: true }),
      DietPlan.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('dietId', 'activity goals dietPreference cuisine')
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      count: dietPlans.length,
      dietPlans
    });
  } catch (err) {
    console.error('Fetch all diet plans error:', err);
    res.status(500).json({ message: 'Failed to fetch diet plans', error: err.message });
  }
});

// Get a specific diet plan by ID
app.get('/api/diet-plans/detail/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const dietPlan = await DietPlan.findById(planId)
      .populate('dietId', 'activity goals dietPreference cuisine conditions');
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    
    res.json({ 
      success: true, 
      dietPlan 
    });
  } catch (err) {
    console.error('Fetch diet plan detail error:', err);
    res.status(500).json({ message: 'Failed to fetch diet plan', error: err.message });
  }
});

// Deactivate a diet plan (soft delete)
app.patch('/api/diet-plans/:planId/deactivate', async (req, res) => {
  try {
    const { planId } = req.params;
    const dietPlan = await DietPlan.findByIdAndUpdate(
      planId, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Diet plan deactivated successfully',
      dietPlan 
    });
  } catch (err) {
    console.error('Deactivate diet plan error:', err);
    res.status(500).json({ message: 'Failed to deactivate diet plan', error: err.message });
  }
});

// Get active diet plan for a user
app.get('/api/diet-plans/:userId/active', async (req, res) => {
  try {
    const { userId } = req.params;
    const activeDietPlan = await DietPlan.findOne({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .populate('dietId', 'activity goals dietPreference cuisine conditions');
    
    if (!activeDietPlan) {
      return res.status(404).json({ message: 'No active diet plan found' });
    }
    
    res.json({ 
      success: true, 
      dietPlan: activeDietPlan 
    });
  } catch (err) {
    console.error('Fetch active diet plan error:', err);
    res.status(500).json({ message: 'Failed to fetch active diet plan', error: err.message });
  }
});

app.listen(PORT, () => console.log(`diet-service running on ${PORT}`));


