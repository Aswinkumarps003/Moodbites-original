// integratedService.js - Complete mood-to-recipe service
import { getRecipesByMood, getRecipesByMoodWithPreferences } from "./fetchRecipes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class MoodToRecipeService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    if (!this.apiKey) {
      throw new Error("SPOONACULAR_API_KEY environment variable is required");
    }
  }

  /**
   * Complete workflow: Text → Mood → Recipes
   * @param {string} text - User's text input
   * @param {string} detectedMood - Mood from FastAPI service
   * @param {Object} preferences - Dietary preferences
   * @returns {Object} Complete recommendation
   */
  async getCompleteRecommendation(text, detectedMood, preferences = {}) {
    try {
      console.log(`🎭 Processing: "${text}" → ${detectedMood}`);
      
      // Get recipes based on detected mood
      const recipes = await getRecipesByMoodWithPreferences(detectedMood, preferences);
      
      // Format the response
      const recommendation = {
        userInput: text,
        detectedMood: detectedMood,
        moodDescription: this.getMoodDescription(detectedMood),
        foodCategory: recipes.query,
        recipes: recipes.results.map(recipe => this.formatRecipe(recipe)),
        totalFound: recipes.totalFound,
        timestamp: new Date().toISOString()
      };

      return recommendation;
      
    } catch (error) {
      console.error("Error in complete recommendation:", error);
      throw error;
    }
  }

  /**
   * Get recipes for a specific mood
   * @param {string} mood - The detected mood
   * @param {Object} preferences - Dietary preferences
   * @returns {Object} Recipe recommendations
   */
  async getRecipesForMood(mood, preferences = {}) {
    try {
      const recipes = await getRecipesByMoodWithPreferences(mood, preferences);
      
      return {
        mood: mood,
        moodDescription: this.getMoodDescription(mood),
        foodCategory: recipes.query,
        recipes: recipes.results.map(recipe => this.formatRecipe(recipe)),
        totalFound: recipes.totalFound
      };
      
    } catch (error) {
      console.error(`Error getting recipes for mood "${mood}":`, error);
      throw error;
    }
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
   * Format recipe data for frontend
   * @param {Object} recipe - Raw recipe from Spoonacular
   * @returns {Object} Formatted recipe
   */
  formatRecipe(recipe) {
    return {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      spoonacularScore: recipe.spoonacularScore,
      calories: this.extractCalories(recipe),
      protein: this.extractNutrient(recipe, 'Protein'),
      carbs: this.extractNutrient(recipe, 'Carbohydrates'),
      fat: this.extractNutrient(recipe, 'Fat'),
      ingredients: recipe.extendedIngredients?.slice(0, 5) || [], // First 5 ingredients
      instructions: recipe.instructions ? this.cleanInstructions(recipe.instructions) : null,
      sourceUrl: recipe.sourceUrl,
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || [],
      diets: recipe.diets || []
    };
  }

  /**
   * Extract calories from recipe nutrition
   * @param {Object} recipe - Recipe object
   * @returns {number|null} Calories
   */
  extractCalories(recipe) {
    if (recipe.nutrition?.nutrients) {
      const calories = recipe.nutrition.nutrients.find(n => n.name === 'Calories');
      return calories ? Math.round(calories.amount) : null;
    }
    return null;
  }

  /**
   * Extract specific nutrient from recipe
   * @param {Object} recipe - Recipe object
   * @param {string} nutrientName - Name of nutrient
   * @returns {string|null} Formatted nutrient value
   */
  extractNutrient(recipe, nutrientName) {
    if (recipe.nutrition?.nutrients) {
      const nutrient = recipe.nutrition.nutrients.find(n => n.name === nutrientName);
      return nutrient ? `${Math.round(nutrient.amount)}${nutrient.unit}` : null;
    }
    return null;
  }

  /**
   * Clean HTML instructions
   * @param {string} instructions - Raw instructions
   * @returns {string} Cleaned instructions
   */
  cleanInstructions(instructions) {
    return instructions
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .trim();
  }

  /**
   * Get available moods
   * @returns {Array} List of available moods
   */
  getAvailableMoods() {
    return [
      'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'
    ];
  }

  /**
   * Get dietary preference options
   * @returns {Object} Available preference options
   */
  getDietaryOptions() {
    return {
      cuisines: ['italian', 'mexican', 'chinese', 'indian', 'japanese', 'thai', 'mediterranean'],
      diets: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo'],
      intolerances: ['dairy', 'egg', 'gluten', 'peanut', 'seafood', 'shellfish', 'soy', 'wheat']
    };
  }
}

// Example usage
async function demonstrateIntegratedService() {
  try {
    const service = new MoodToRecipeService();
    
    console.log("🍽️  MoodBites Integrated Service Demo");
    console.log("=" .repeat(50));
    
    // Simulate mood detection from FastAPI
    const userInput = "I'm feeling really sad and need something comforting";
    const detectedMood = "sadness"; // This would come from your FastAPI service
    
    console.log(`\n📝 User Input: "${userInput}"`);
    console.log(`🎭 Detected Mood: ${detectedMood}`);
    
    // Get complete recommendation
    const recommendation = await service.getCompleteRecommendation(
      userInput, 
      detectedMood,
      { numberOfRecipes: 3, cuisine: 'italian' }
    );
    
    console.log("\n🎯 Complete Recommendation:");
    console.log(JSON.stringify(recommendation, null, 2));
    
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  }
}

// Export the service class
export default MoodToRecipeService;

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateIntegratedService();
}
