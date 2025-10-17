const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// ENV
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5005; // Use 5005 as default
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BLOOD_REPORT_BASE_URL = process.env.BLOOD_REPORT_BASE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Added GEMINI_API_KEY

// --- CRITICAL CORS FIX ---
// Allowing both the main Vercel domain and the dynamic/preview Vercel domain
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://moodbites-frontend.vercel.app',
    'https://moodbites-frontend-eyjvu60bc-aswin-kumar-p-ss-projects.vercel.app',
    // Add other deployment URLs if known
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // Or if the origin is explicitly allowed
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // console.log(`CORS Blocked: Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// --- END CORS FIX ---


app.use(express.json());

// --- Database Connection Fix ---
const connectDb = async () => {
    if (!MONGO_URI) {
        console.error('diet-service Mongo error: MONGO_URI not set.');
        return;
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ diet-service connected to MongoDB');
    } catch (err) {
        console.error('⚠️  diet-service Mongo error:', err.message);
        // Do not crash the server if DB fails, allow it to run with limited functionality
    }
};

connectDb(); 
// --- END Database Connection Fix ---


// Models (omitted for brevity, assume correct)
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
  // Sharing to a dietician for review/consultation
  sharedWithDietician: {
    dieticianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    status: { type: String, enum: ['not_shared','pending','accepted','rejected'], default: 'not_shared' },
    sharedAt: { type: Date, default: null }
  },
  // Dietician recommendations
  recommendations: [{
    dieticianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, required: true },
    suggestedChanges: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, enum: ['proposed','accepted','rejected'], default: 'proposed' },
    createdAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Diet = mongoose.model('Diet', dietSchema);
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);


// --- ADDED HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
    res.send('Diet Service Running');
});
// --------------------------------


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

// Helper: fetch recipes from Spoonacular using cuisine + diet filters
async function fetchSpoonacularRecipes(dietDoc) {
  let baseUrl = `https://api.spoonacular.com/recipes/complexSearch?number=5&addRecipeNutrition=true&addRecipeInformation=true&imageType=jpg&apiKey=${SPOONACULAR_API_KEY}`;

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
      ingredients: recipe.nutrition?.ingredients?.map(i => i.name) || [],
      image: recipe.image || null,
      readyInMinutes: recipe.readyInMinutes || 30,
      servings: recipe.servings || 1
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
    const dietPlans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    res.json({ count: dietPlans.length, diets: dietPlans }); // Corrected 'diets' to 'dietPlans' in response
  } catch (err) {
    console.error('Fetch diet error', err);
    res.status(500).json({ message: 'Server error' });
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
      .populate('dietId', 'activity goals dietPreference cuisine conditions')
      .populate('sharedWithDietician.dieticianId', 'name email')
      .populate('recommendations.dieticianId', 'name email');
    
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

// Spoonacular: proxy search (for overrides)
app.get('/api/spoonacular/search', async (req, res) => {
  try {
    if (!SPOONACULAR_API_KEY) {
      return res.status(400).json({ message: 'Missing SPOONACULAR_API_KEY' });
    }
    const q = String(req.query.q || '').trim();
    const number = parseInt(req.query.number || '10', 10);
    const cuisine = String(req.query.cuisine || '').trim();
    const dietPreference = String(req.query.dietPreference || '').trim();
    const lowSugar = String(req.query.lowSugar || '').toLowerCase() === 'true';
    const lowCholesterol = String(req.query.lowCholesterol || '').toLowerCase() === 'true';
    const lowSaturatedFat = String(req.query.lowSaturatedFat || '').toLowerCase() === 'true';
    const lowCarb = String(req.query.lowCarb || '').toLowerCase() === 'true';

    if (!q) return res.status(400).json({ message: 'q is required' });

    let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(q)}&number=${Math.min(Math.max(number,1),25)}&addRecipeInformation=true&addRecipeNutrition=true&imageType=jpg&apiKey=${SPOONACULAR_API_KEY}`;
    if (cuisine) url += `&cuisine=${encodeURIComponent(cuisine)}`;
    if (dietPreference) {
      const map = { 'Veg': 'vegetarian', 'Vegan': 'vegan', 'Eggetarian': 'vegetarian' };
      const diet = map[dietPreference] || '';
      if (diet) url += `&diet=${encodeURIComponent(diet)}`;
    }
    if (lowSugar) url += `&maxSugar=12`;
    if (lowCholesterol) url += `&maxCholesterol=150&maxSaturatedFat=7`;
    if (lowSaturatedFat) url += `&maxSaturatedFat=7`;
    if (lowCarb) url += `&maxCarbs=50&diet=low-carb`;
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) return res.status(r.status).send(text);
    const json = JSON.parse(text);
    return res.json({ success: true, results: json.results || [] });
  } catch (err) {
    console.error('spoonacular search error:', err);
    return res.status(500).json({ message: 'Failed to search recipes', error: err.message });
  }
});

// Spoonacular: fetch a single recipe by ID with nutrition
app.get('/api/spoonacular/recipes/:id', async (req, res) => {
  try {
    if (!SPOONACULAR_API_KEY) {
      return res.status(400).json({ message: 'Missing SPOONACULAR_API_KEY' });
    }
    const id = req.params.id;
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) return res.status(r.status).send(text);
    const json = JSON.parse(text);
    return res.json({ success: true, recipe: json });
  } catch (err) {
    console.error('spoonacular get recipe error:', err);
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
});

// Replace a meal in a diet plan with a new Spoonacular recipe
app.patch('/api/diet-plans/:planId/meals/replace', async (req, res) => {
  try {
    const { planId } = req.params;
    const { mealType, mealIndex, spoonacularId } = req.body || {};
    if (!spoonacularId) return res.status(400).json({ message: 'spoonacularId is required' });
    const plan = await DietPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });

    // Fetch recipe details
    if (!SPOONACULAR_API_KEY) {
      return res.status(400).json({ message: 'Missing SPOONACULAR_API_KEY' });
    }
    const recipeUrl = `https://api.spoonacular.com/recipes/${spoonacularId}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;
    const r = await fetch(recipeUrl);
    const text = await r.text();
    if (!r.ok) return res.status(r.status).send(text);
    const recipe = JSON.parse(text);

    // Build meal object consistent with stored structure
    const nutrition = recipe.nutrition?.nutrients || [];
    const calories = Math.round(nutrition.find(n => n.name === 'Calories')?.amount || 0);
    const protein = Math.round(nutrition.find(n => n.name === 'Protein')?.amount || 0);
    const carbs = Math.round(nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0);
    const fat = Math.round(nutrition.find(n => n.name === 'Fat')?.amount || 0);
    const fiber = Math.round(nutrition.find(n => n.name === 'Fiber')?.amount || 0);
    const sugar = Math.round(nutrition.find(n => n.name === 'Sugar')?.amount || 0);

    const newMeal = {
      mealType: mealType || (plan.meals[mealIndex]?.mealType) || 'Meal',
      recipe: recipe.title,
      calories,
      ingredients: (recipe.nutrition?.ingredients || []).map(i => i.name),
      spoonacularId: recipe.id,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 30,
      servings: recipe.servings || 1,
      nutrition: { protein, carbs, fat, fiber, sugar }
    };

    // Find target index
    let idx = -1;
    if (Number.isInteger(mealIndex)) idx = Math.max(0, Math.min(plan.meals.length - 1, mealIndex));
    if (idx < 0 && mealType) {
      idx = plan.meals.findIndex(m => (m.mealType || '').toLowerCase() === String(mealType).toLowerCase());
    }
    if (idx < 0) return res.status(400).json({ message: 'Specify a valid mealIndex or mealType' });

    // Replace and recalc total calories
    plan.meals[idx] = newMeal;
    const totalCalories = plan.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    plan.totalCalories = `${totalCalories} kcal`;
    await plan.save();

    return res.json({ success: true, dietPlan: plan });
  } catch (err) {
    console.error('replace meal error:', err);
    return res.status(500).json({ message: 'Failed to replace meal', error: err.message });
  }
});

// Share a plan to a dietician (user triggers)
app.post('/api/diet-plans/:planId/share', async (req, res) => {
  try {
    const { planId } = req.params;
    const { dieticianId } = req.body;
    if (!dieticianId) return res.status(400).json({ message: 'dieticianId is required' });
    const plan = await DietPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    plan.sharedWithDietician = { dieticianId, status: 'pending', sharedAt: new Date() };
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    console.error('Share plan error:', err);
    res.status(500).json({ message: 'Failed to share plan', error: err.message });
  }
});

// Dietician: list plans shared with them
app.get('/api/dietician/:dieticianId/shared-plans', async (req, res) => {
  try {
    const { dieticianId } = req.params;
    const plans = await DietPlan.find({ 'sharedWithDietician.dieticianId': dieticianId })
      .sort({ updatedAt: -1 })
      .populate('userId', 'name email')
      .populate('dietId', 'activity goals dietPreference cuisine')
      .select('-recommendations.suggestedChanges');
    res.json({ success: true, count: plans.length, plans });
  } catch (err) {
    console.error('List shared plans error:', err);
    res.status(500).json({ message: 'Failed to list shared plans', error: err.message });
  }
});

// Dietician: respond to share (accept/reject)
app.patch('/api/diet-plans/:planId/share/status', async (req, res) => {
  try {
    const { planId } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'
    if (!['accepted','rejected'].includes(status)) return res.status(400).json({ message: 'invalid status' });
    const plan = await DietPlan.findByIdAndUpdate(planId, { 'sharedWithDietician.status': status }, { new: true });
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json({ success: true, plan });
  } catch (err) {
    console.error('Update share status error:', err);
    res.status(500).json({ message: 'Failed to update share status', error: err.message });
  }
});

// Dietician: add recommendation to a shared plan
app.post('/api/diet-plans/:planId/recommendations', async (req, res) => {
  try {
    const { planId } = req.params;
    const { dieticianId, note, suggestedChanges } = req.body;
    if (!dieticianId || !note) return res.status(400).json({ message: 'dieticianId and note are required' });
    const plan = await DietPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    plan.recommendations.push({ dieticianId, note, suggestedChanges: suggestedChanges || null, status: 'proposed', createdAt: new Date() });
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (err) {
    console.error('Add recommendation error:', err);
    res.status(500).json({ message: 'Failed to add recommendation', error: err.message });
  }
});

// User: accept or reject a recommendation
app.patch('/api/diet-plans/:planId/recommendations/:recId/status', async (req, res) => {
  try {
    const { planId, recId } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'
    if (!['accepted','rejected'].includes(status)) return res.status(400).json({ message: 'invalid status' });
    const plan = await DietPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    const rec = plan.recommendations.id(recId);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });
    rec.status = status;
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    console.error('Update recommendation status error:', err);
    res.status(500).json({ message: 'Failed to update recommendation status', error: err.message });
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

// Admin: explicitly set plan active status
app.patch('/api/diet-plans/:planId/status', async (req, res) => {
  try {
    const { planId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive boolean is required' });
    }

    const dietPlan = await DietPlan.findByIdAndUpdate(
      planId,
      { isActive },
      { new: true }
    );

    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.json({ success: true, dietPlan });
  } catch (err) {
    console.error('Update diet plan status error:', err);
    res.status(500).json({ message: 'Failed to update diet plan status', error: err.message });
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

// =================== Personalized Recipes Based on Blood Report ===================

// Map analysisResults.tests to key biomarkers
function extractBiomarkersFromReport(report) {
  const out = { glucose: null, totalCholesterol: null, ldl: null, hdl: null, triglycerides: null };
  const tests = report?.analysisResults?.tests || [];
  const norm = (s) => (s || '').toLowerCase().trim();
  tests.forEach(t => {
    const name = norm(t.name);
    const valueNum = parseFloat(String(t.value || '').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(valueNum)) {
      if (name.includes('glucose') || name.includes('sugar')) out.glucose = valueNum;
      else if (name.includes('total') && name.includes('cholesterol')) out.totalCholesterol = valueNum;
      else if (name.includes('ldl')) out.ldl = valueNum;
      else if (name.includes('hdl')) out.hdl = valueNum;
      else if (name.includes('triglycer')) out.triglycerides = valueNum;
    }
  });
  return out;
}

// Thresholds (basic clinical cutoffs; can be refined)
const BIOMARKER_THRESHOLDS = {
  glucoseHigh: 125, // mg/dL fasting
  glucoseBorderline: 100,
  totalCholHigh: 240, // mg/dL
  totalCholBorderline: 200,
  ldlHigh: 160,
  ldlBorderline: 130,
  triglyceridesHigh: 200,
  triglyceridesBorderline: 150,
};

function buildSpoonacularParamsForHealth(bio) {
  const params = new URLSearchParams();
  // Base healthy filters
  params.set('number', '10');
  params.set('addRecipeNutrition', 'true');

  // Glucose driven
  if ((bio.glucose && bio.glucose >= BIOMARKER_THRESHOLDS.glucoseBorderline)) {
    params.set('maxSugar', '10'); // grams per serving
    params.append('intolerances', 'sugar');
    params.set('sort', 'healthiness');
    // Prefer low carb for glucose control
    params.set('diet', 'low-carb');
  }

  // Cholesterol/LDL driven
  const cholRisk = (bio.totalCholesterol && bio.totalCholesterol >= BIOMARKER_THRESHOLDS.totalCholBorderline) ||
                   (bio.ldl && bio.ldl >= BIOMARKER_THRESHOLDS.ldlBorderline);
  if (cholRisk) {
    params.set('maxSaturatedFat', '7'); // grams
    params.set('maxCholesterol', '150'); // mg
    // Prefer low fat
    if (!params.get('diet')) params.set('diet', 'low-fat');
  }

  // Triglycerides
  if (bio.triglycerides && bio.triglycerides >= BIOMARKER_THRESHOLDS.triglyceridesBorderline) {
    // Encourage lower simple carbs
    if (!params.get('maxSugar')) params.set('maxSugar', '12');
    params.set('maxCarbs', '50'); // grams (rough guide)
  }

  return params;
}

async function fetchPersonalizedRecipesFromSpoonacular(params) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&${params.toString()}`;
  const resp = await fetch(url);
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Spoonacular error ${resp.status}: ${text}`);
  }
  const data = JSON.parse(text);
  return Array.isArray(data.results) ? data.results : [];
}

// Core function: getPersonalizedRecipes(userId)
async function getPersonalizedRecipes(userId) {
  // 1) Check latest blood report
  const r = await fetch(`${BLOOD_REPORT_BASE_URL}/api/blood-report/latest/${userId}`);
  if (!r.ok) return { personalized: false, recipes: [] };
  const json = await r.json();
  const report = json.report;
  if (!report || !report.analysisResults) return { personalized: false, recipes: [] };

  // 2) Extract biomarkers and build params
  const biomarkers = extractBiomarkersFromReport(report);
  const params = buildSpoonacularParamsForHealth(biomarkers);

  // 3) Fetch recipes
  const recipes = await fetchPersonalizedRecipesFromSpoonacular(params);
  return { personalized: true, recipes, biomarkers };
}

// Public endpoint
app.get('/api/diet-plans/personalized/recipes/:userId', async (req, res) => {
  try {
    if (!SPOONACULAR_API_KEY) {
      return res.status(400).json({ message: 'Missing SPOONACULAR_API_KEY' });
    }
    const { userId } = req.params;
    const result = await getPersonalizedRecipes(userId);
    if (!result.personalized) {
      // Fallback: use last diet doc filters (non-personalized)
      const dietDoc = await Diet.findOne({ userId }).sort({ createdAt: -1 });
      const fallbackRecipes = dietDoc ? await fetchSpoonacularRecipes(dietDoc) : [];
      return res.json({ success: true, personalized: false, recipes: fallbackRecipes });
    }

    return res.json({ success: true, personalized: true, biomarkers: result.biomarkers, recipes: result.recipes });
  } catch (err) {
    console.error('Personalized recipes error:', err);
    res.status(500).json({ message: 'Failed to fetch personalized recipes', error: err.message });
  }
});

app.listen(PORT, () => console.log(`diet-service running on ${PORT}`));
