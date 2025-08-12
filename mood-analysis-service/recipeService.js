// recipeService.js - Service to fetch recipes from Spoonacular based on mood
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Mood to food mapping for Spoonacular API
const moodToFoodMapping = {
  joy: {
    query: "dessert",
    cuisine: "american",
    type: "dessert",
    maxReadyTime: 60,
    maxCalories: 600
  },
  sadness: {
    query: "comfort food",
    cuisine: "italian",
    type: "main course",
    maxReadyTime: 45,
    maxCalories: 800
  },
  anger: {
    query: "spicy food",
    cuisine: "thai",
    type: "main course",
    maxReadyTime: 40,
    maxCalories: 700
  },
  fear: {
    query: "soothing soup",
    cuisine: "mediterranean",
    type: "soup",
    maxReadyTime: 30,
    maxCalories: 400
  },
  surprise: {
    query: "fusion cuisine",
    cuisine: "japanese",
    type: "main course",
    maxReadyTime: 50,
    maxCalories: 600
  },
  disgust: {
    query: "light salad",
    cuisine: "mediterranean",
    type: "salad",
    maxReadyTime: 20,
    maxCalories: 300
  },
  neutral: {
    query: "pasta",
    cuisine: "italian",
    type: "main course",
    maxReadyTime: 35,
    maxCalories: 500
  }
};

class RecipeService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    if (!this.apiKey) {
      console.warn("⚠️ SPOONACULAR_API_KEY not set. Using mock data.");
    }
  }

  /**
   * Fetch recipes based on detected mood
   * @param {string} mood - The detected mood
   * @param {Object} preferences - User preferences
   * @returns {Array} Array of recipes
   */
  async getRecipesByMood(mood, preferences = {}) {
    try {
      if (!this.apiKey) {
        return this.getMockRecipes(mood);
      }

      const moodConfig = moodToFoodMapping[mood.toLowerCase()] || moodToFoodMapping.neutral;
      
      // Build API URL with parameters
      const params = new URLSearchParams({
        query: moodConfig.query,
        number: preferences.number || 6,
        apiKey: this.apiKey,
        addRecipeInformation: 'true',
        fillIngredients: 'true',
        instructionsRequired: 'true',
        addRecipeNutrition: 'true',
        maxReadyTime: moodConfig.maxReadyTime,
        maxCalories: moodConfig.maxCalories,
        type: moodConfig.type
      });

      // Add optional preferences
      if (preferences.cuisine && preferences.cuisine !== 'all') {
        params.append('cuisine', preferences.cuisine);
      } else if (moodConfig.cuisine) {
        params.append('cuisine', moodConfig.cuisine);
      }

      if (preferences.diet && preferences.diet !== 'all') {
        params.append('diet', preferences.diet);
      }

      if (preferences.maxReadyTime) {
        params.set('maxReadyTime', preferences.maxReadyTime);
      }

      if (preferences.maxCalories) {
        params.set('maxCalories', preferences.maxCalories);
      }

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params}`;
      
      console.log(`🔍 Fetching recipes for mood: ${mood}`);
      console.log(`🌐 API URL: ${url.replace(this.apiKey, '***')}`);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform recipes to match your frontend format
      const recipes = data.results.map(recipe => this.transformRecipe(recipe, mood));
      
      console.log(`✅ Found ${recipes.length} recipes for mood: ${mood}`);
      
      return {
        mood: mood,
        moodDescription: this.getMoodDescription(mood),
        foodCategory: moodConfig.query,
        recipes: recipes,
        totalFound: data.totalResults || 0
      };

    } catch (error) {
      console.error(`❌ Error fetching recipes for mood "${mood}":`, error);
      
      // Fallback to mock data
      console.log("🔄 Falling back to mock recipes...");
      return {
        mood: mood,
        moodDescription: this.getMoodDescription(mood),
        foodCategory: moodToFoodMapping[mood.toLowerCase()]?.query || "food",
        recipes: this.getMockRecipes(mood),
        totalFound: 0,
        error: error.message
      };
    }
  }

  /**
   * Transform Spoonacular recipe to frontend format
   * @param {Object} recipe - Raw recipe from Spoonacular
   * @param {string} mood - The detected mood
   * @returns {Object} Transformed recipe
   */
  transformRecipe(recipe, mood) {
    // Extract nutrition info
    const nutrition = recipe.nutrition?.nutrients || [];
    const calories = nutrition.find(n => n.name === 'Calories')?.amount || 0;
    const protein = nutrition.find(n => n.name === 'Protein')?.amount || 0;
    const carbs = nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0;
    const fat = nutrition.find(n => n.name === 'Fat')?.amount || 0;

    return {
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      calories: Math.round(calories),
      protein: `${Math.round(protein)}g`,
      carbs: `${Math.round(carbs)}g`,
      fats: `${Math.round(fat)}g`,
      moodBenefit: this.getMoodBenefit(mood, recipe),
      cuisine: recipe.cuisines?.[0] || 'international',
      time: this.getMealTime(recipe.readyInMinutes),
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      instructions: recipe.instructions,
      ingredients: recipe.extendedIngredients?.slice(0, 5) || [],
      sourceUrl: recipe.sourceUrl,
      spoonacularScore: recipe.spoonacularScore
    };
  }

  /**
   * Get mood description
   * @param {string} mood - The mood
   * @returns {string} Description
   */
  getMoodDescription(mood) {
    const descriptions = {
      joy: "Feeling happy and energetic - perfect for sweet treats and celebration food!",
      sadness: "Feeling down - comfort food and warm dishes to lift your spirits",
      anger: "Feeling frustrated - spicy and fiery dishes to match your energy",
      fear: "Feeling anxious - soothing and gentle flavors to calm your nerves",
      surprise: "Feeling excited - adventurous and fusion cuisine for your enthusiasm",
      disgust: "Feeling turned off - light and fresh ingredients to reset your palate",
      neutral: "Feeling balanced - classic and everyday dishes for your calm state"
    };
    
    return descriptions[mood.toLowerCase()] || "Feeling neutral - balanced meals for your current state";
  }

  /**
   * Get mood-specific food benefit
   * @param {string} mood - The mood
   * @param {Object} recipe - The recipe
   * @returns {string} Benefit description
   */
  getMoodBenefit(mood, recipe) {
    const benefits = {
      joy: "Boosts serotonin with natural carbs and colorful nutrients",
      sadness: "Comforting and warming, perfect for lifting spirits",
      anger: "Spicy food can help release endorphins and reduce stress",
      fear: "Gentle and soothing, helps calm nerves",
      surprise: "Exciting flavors and textures to match your enthusiasm",
      disgust: "Clean, fresh ingredients to reset your palate",
      neutral: "Balanced and nutritious for your calm state"
    };
    
    return benefits[mood.toLowerCase()] || "Nutritious and delicious for your current mood";
  }

  /**
   * Get meal time based on cooking time
   * @param {number} readyInMinutes - Cooking time
   * @returns {string} Meal time
   */
  getMealTime(readyInMinutes) {
    if (readyInMinutes <= 15) return "quick";
    if (readyInMinutes <= 30) return "lunch";
    if (readyInMinutes <= 60) return "dinner";
    return "special";
  }

  /**
   * Get mock recipes when API is not available
   * @param {string} mood - The mood
   * @returns {Array} Mock recipes
   */
  getMockRecipes(mood) {
    const mockRecipes = {
      joy: [
        {
          id: 1,
          name: "Rainbow Buddha Bowl",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
          calories: 420,
          protein: "18g",
          carbs: "45g",
          fats: "22g",
          moodBenefit: "Boosts serotonin with natural carbs and colorful nutrients",
          cuisine: "vegan",
          time: "lunch"
        }
      ],
      sadness: [
        {
          id: 2,
          name: "Warm Chicken Soup",
          image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
          calories: 320,
          protein: "25g",
          carbs: "28g",
          fats: "15g",
          moodBenefit: "Comforting and warming, perfect for lifting spirits",
          cuisine: "comfort",
          time: "dinner"
        }
      ]
    };
    
    return mockRecipes[mood.toLowerCase()] || mockRecipes.joy;
  }

  /**
   * Get available cuisines
   * @returns {Array} List of cuisines
   */
  getAvailableCuisines() {
    return [
      'american', 'italian', 'mexican', 'chinese', 'japanese', 'thai', 
      'indian', 'mediterranean', 'french', 'greek', 'spanish', 'korean'
    ];
  }

  /**
   * Get available diets
   * @returns {Array} List of diets
   */
  getAvailableDiets() {
    return [
      'vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo', 'pescatarian'
    ];
  }
}

export default RecipeService;
