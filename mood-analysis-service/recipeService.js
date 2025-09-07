// recipeService.js - Comprehensive Spoonacular API service for mood-based recipe recommendations
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Enhanced mood to food mapping with multiple search strategies
const moodToFoodMapping = {
  joy: {
    queries: ["dessert", "sweet treats", "celebration food", "colorful dishes", "party snacks"],
    cuisines: ["american", "italian", "french"],
    diets: ["vegetarian"],
    mealTypes: ["dessert", "snack"],
    maxReadyTime: 60,
    maxCalories: 600,
    minProtein: 0,
    maxProtein: 20,
    searchStrategies: ["complexSearch", "randomRecipes", "findByIngredients", "searchByNutrients"]
  },
  sadness: {
    queries: ["comfort food", "warm soup", "chocolate", "homemade bread", "mac and cheese", "hearty meals"],
    cuisines: ["italian", "american", "comfort"],
    diets: ["vegetarian"],
    mealTypes: ["main course", "soup"],
    maxReadyTime: 45,
    maxCalories: 800,
    minProtein: 10,
    maxProtein: 40,
    searchStrategies: ["complexSearch", "findByIngredients", "randomRecipes", "searchByNutrients"]
  },
  anger: {
    queries: ["spicy food", "hot sauce", "chili", "fiery dishes", "curry", "bold flavors"],
    cuisines: ["thai", "indian", "mexican", "korean"],
    diets: ["vegetarian", "vegan"],
    mealTypes: ["main course"],
    maxReadyTime: 40,
    maxCalories: 700,
    minProtein: 15,
    maxProtein: 35,
    searchStrategies: ["complexSearch", "findByIngredients", "randomRecipes", "searchByNutrients"]
  },
  fear: {
    queries: ["soothing soup", "calming tea", "gentle flavors", "easy recipes", "light meals", "comforting"],
    cuisines: ["mediterranean", "japanese", "chinese"],
    diets: ["vegetarian", "gluten-free"],
    mealTypes: ["soup", "main course"],
    maxReadyTime: 30,
    maxCalories: 400,
    minProtein: 5,
    maxProtein: 25,
    searchStrategies: ["complexSearch", "findByIngredients", "randomRecipes", "searchByNutrients"]
  },
  surprise: {
    queries: ["fusion cuisine", "exotic dishes", "unusual combinations", "adventurous food", "creative"],
    cuisines: ["japanese", "fusion", "molecular"],
    diets: ["vegetarian"],
    mealTypes: ["main course", "appetizer"],
    maxReadyTime: 50,
    maxCalories: 600,
    minProtein: 10,
    maxProtein: 30,
    searchStrategies: ["complexSearch", "randomRecipes", "findByIngredients", "searchByNutrients"]
  },
  disgust: {
    queries: ["light salad", "fresh ingredients", "clean eating", "simple recipes", "detox", "healthy"],
    cuisines: ["mediterranean", "raw", "healthy"],
    diets: ["vegetarian", "vegan", "raw"],
    mealTypes: ["salad", "appetizer"],
    maxReadyTime: 20,
    maxCalories: 300,
    minProtein: 5,
    maxProtein: 20,
    searchStrategies: ["complexSearch", "findByIngredients", "randomRecipes", "searchByNutrients"]
  },
  neutral: {
    queries: ["pasta", "balanced meals", "classic dishes", "everyday food", "traditional"],
    cuisines: ["italian", "american", "mediterranean"],
    diets: ["vegetarian"],
    mealTypes: ["main course"],
    maxReadyTime: 35,
    maxCalories: 500,
    minProtein: 10,
    maxProtein: 30,
    searchStrategies: ["complexSearch", "findByIngredients", "randomRecipes", "searchByNutrients"]
  }
};

class RecipeService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    this.baseUrl = "https://api.spoonacular.com";
    this.requestDelay = 100; // ms between requests to respect rate limits
    
    if (!this.apiKey) {
      console.warn("⚠️ SPOONACULAR_API_KEY not set. Using mock data.");
    }
  }

  /**
   * Comprehensive recipe fetching using multiple Spoonacular strategies
   * @param {string} mood - The detected mood
   * @param {Object} preferences - User preferences
   * @returns {Object} Comprehensive recipe results
   */
  async getRecipesByMood(mood, preferences = {}) {
    try {
      if (!this.apiKey) {
        return this.getMockRecipes(mood);
      }

      const moodConfig = moodToFoodMapping[mood.toLowerCase()] || moodToFoodMapping.neutral;
      const results = {
        mood: mood,
        moodDescription: this.getMoodDescription(mood),
        foodCategory: moodConfig.queries[0],
        recipes: [],
        ingredients: [],
        nutrition: {},
        totalFound: 0,
        searchStrategies: moodConfig.searchStrategies
      };

      console.log(`🍽️ Fetching comprehensive recipes for mood: ${mood}`);

      // Strategy 1: Complex Search (Primary)
      if (moodConfig.searchStrategies.includes("complexSearch")) {
        const complexResults = await this.complexSearch(moodConfig, preferences, mood);
        results.recipes.push(...complexResults.recipes);
        results.totalFound += complexResults.totalFound;
      }

      // Strategy 2: Random Recipes (For variety)
      if (moodConfig.searchStrategies.includes("randomRecipes")) {
        const randomResults = await this.getRandomRecipes(moodConfig, preferences, mood);
        results.recipes.push(...randomResults.recipes);
      }

      // Strategy 3: Find by Ingredients
      if (moodConfig.searchStrategies.includes("findByIngredients")) {
        const ingredientResults = await this.findByIngredients(moodConfig, preferences, mood);
        results.recipes.push(...ingredientResults.recipes);
      }

      // Strategy 4: Search by Nutrients
      if (moodConfig.searchStrategies.includes("searchByNutrients")) {
        const nutrientResults = await this.searchByNutrients(moodConfig, preferences, mood);
        results.recipes.push(...nutrientResults.recipes);
      }

      // Get ingredient suggestions
      results.ingredients = await this.getIngredientSuggestions(moodConfig);

      // Get nutrition analysis
      if (results.recipes.length > 0) {
        results.nutrition = await this.analyzeNutrition(results.recipes.slice(0, 3));
      }

      // Remove duplicates and limit results
      results.recipes = this.removeDuplicateRecipes(results.recipes).slice(0, preferences.number || 12);

      console.log(`✅ Found ${results.recipes.length} comprehensive recipes for mood: ${mood}`);
      
      return results;

    } catch (error) {
      console.error(`❌ Error fetching comprehensive recipes for mood "${mood}":`, error);
      
      // Fallback to mock data
      console.log("🔄 Falling back to mock recipes...");
      return {
        mood: mood,
        moodDescription: this.getMoodDescription(mood),
        foodCategory: moodToFoodMapping[mood.toLowerCase()]?.queries?.[0] || "food",
        recipes: this.getMockRecipes(mood),
        ingredients: [],
        nutrition: {},
        totalFound: 0,
        searchStrategies: ["mock"],
        error: error.message
      };
    }
  }

  // ==================== SPOONACULAR API METHODS ====================

  /**
   * Complex Search - Primary Spoonacular search endpoint
   */
  async complexSearch(moodConfig, preferences, mood) {
    const params = new URLSearchParams({
      query: moodConfig.queries[0],
      number: Math.min(preferences.number || 6, 12),
      apiKey: this.apiKey,
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      instructionsRequired: 'true',
      addRecipeNutrition: 'true',
      maxReadyTime: moodConfig.maxReadyTime,
      maxCalories: moodConfig.maxCalories,
      minProtein: moodConfig.minProtein,
      maxProtein: moodConfig.maxProtein,
      type: moodConfig.mealTypes[0]
    });

    // Add cuisine filter
    if (preferences.cuisine && preferences.cuisine !== 'all') {
      params.append('cuisine', preferences.cuisine);
    } else if (moodConfig.cuisines[0]) {
      params.append('cuisine', moodConfig.cuisines[0]);
    }

    // Add diet filter
    if (preferences.diet && preferences.diet !== 'all') {
      params.append('diet', preferences.diet);
    } else if (moodConfig.diets[0]) {
      params.append('diet', moodConfig.diets[0]);
    }

    const url = `${this.baseUrl}/recipes/complexSearch?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Complex search error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const recipes = data.results.map(recipe => this.transformRecipe(recipe, mood));
    
    return { recipes, totalFound: data.totalResults || 0 };
  }

  /**
   * Random Recipes - For variety and discovery
   */
  async getRandomRecipes(moodConfig, preferences, mood) {
    const params = new URLSearchParams({
      number: Math.min(preferences.number || 3, 6),
      apiKey: this.apiKey,
      tags: moodConfig.mealTypes.join(',')
    });

    if (moodConfig.diets[0]) {
      params.append('tags', moodConfig.diets[0]);
    }

    const url = `${this.baseUrl}/recipes/random?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Random recipes error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const recipes = data.recipes.map(recipe => this.transformRecipe(recipe, mood));
    
    return { recipes, totalFound: recipes.length };
  }

  /**
   * Find by Ingredients - Based on mood-appropriate ingredients
   */
  async findByIngredients(moodConfig, preferences, mood) {
    const moodIngredients = this.getMoodIngredients(moodConfig);
    const ingredients = moodIngredients.slice(0, 5).join(',');
    
    const params = new URLSearchParams({
      ingredients: ingredients,
      number: Math.min(preferences.number || 3, 6),
      apiKey: this.apiKey,
      ranking: '2', // maximize used ingredients
      ignorePantry: 'true'
    });

    const url = `${this.baseUrl}/recipes/findByIngredients?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Find by ingredients error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const recipes = data.map(recipe => this.transformRecipe(recipe, mood));
    
    return { recipes, totalFound: recipes.length };
  }

  /**
   * Search by Nutrients - Based on mood-specific nutritional needs
   */
  async searchByNutrients(moodConfig, preferences, mood) {
    const params = new URLSearchParams({
      minCalories: Math.max(0, moodConfig.maxCalories - 200),
      maxCalories: moodConfig.maxCalories,
      minProtein: moodConfig.minProtein,
      maxProtein: moodConfig.maxProtein,
      minCarbs: 0,
      maxCarbs: 100,
      minFat: 0,
      maxFat: 50,
      number: Math.min(preferences.number || 3, 6),
      apiKey: this.apiKey,
      addRecipeInformation: 'true'
    });

    const url = `${this.baseUrl}/recipes/findByNutrients?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search by nutrients error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const recipes = data.map(recipe => this.transformRecipe(recipe, mood));
    
    return { recipes, totalFound: recipes.length };
  }

  /**
   * Get Recipe Information - Detailed recipe with nutrition
   */
  async getRecipeInformation(recipeId) {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      includeNutrition: 'true',
      addWinePairing: 'true',
      addTasteData: 'true'
    });

    const url = `${this.baseUrl}/recipes/${recipeId}/information?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Recipe information error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformDetailedRecipe(data);
  }

  /**
   * Get Recipe Information Bulk - Multiple recipes at once
   */
  async getRecipeInformationBulk(recipeIds) {
    const params = new URLSearchParams({
      ids: recipeIds.join(','),
      apiKey: this.apiKey,
      includeNutrition: 'true'
    });

    const url = `${this.baseUrl}/recipes/informationBulk?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Recipe bulk information error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(recipe => this.transformDetailedRecipe(recipe));
  }

  /**
   * Get Similar Recipes
   */
  async getSimilarRecipes(recipeId, limit = 5) {
    const params = new URLSearchParams({
      number: limit,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/recipes/${recipeId}/similar?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Similar recipes error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(recipe => this.transformRecipe(recipe, 'neutral'));
  }

  /**
   * Autocomplete Recipe Search
   */
  async autocompleteRecipeSearch(query, number = 10) {
    const params = new URLSearchParams({
      query: query,
      number: number,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/recipes/autocomplete?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Autocomplete search error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      title: item.title,
      imageType: item.imageType
    }));
  }

  /**
   * Search Ingredients
   */
  async searchIngredients(query, limit = 10) {
    const params = new URLSearchParams({
      query: query,
      number: limit,
      apiKey: this.apiKey,
      addChildren: 'true'
    });

    const url = `${this.baseUrl}/food/ingredients/search?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ingredient search error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      image: ingredient.image,
      aisle: ingredient.aisle
    }));
  }

  /**
   * Get Ingredient Information
   */
  async getIngredientInformation(ingredientId) {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      amount: 1,
      unit: 'cup'
    });

    const url = `${this.baseUrl}/food/ingredients/${ingredientId}/information?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ingredient information error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      image: data.image,
      nutrition: data.nutrition,
      possibleUnits: data.possibleUnits
    };
  }

  /**
   * Autocomplete Ingredient Search
   */
  async autocompleteIngredientSearch(query, number = 10) {
    const params = new URLSearchParams({
      query: query,
      number: number,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/food/ingredients/autocomplete?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ingredient autocomplete error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image
    }));
  }

  /**
   * Get Ingredient Substitutes
   */
  async getIngredientSubstitutes(ingredientName) {
    const params = new URLSearchParams({
      ingredientName: ingredientName,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/food/ingredients/substitutes?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ingredient substitutes error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      ingredient: data.ingredient,
      substitutes: data.substitutes,
      message: data.message
    };
  }

  /**
   * Generate Meal Plan
   */
  async generateMealPlan(mood, timeFrame = 'day') {
    const moodConfig = moodToFoodMapping[mood.toLowerCase()] || moodToFoodMapping.neutral;
    
    const params = new URLSearchParams({
      timeFrame: timeFrame,
      targetCalories: moodConfig.maxCalories,
      diet: moodConfig.diets[0] || 'balanced',
      exclude: 'shellfish,olives',
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/mealplanner/generate?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Meal plan generation error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformMealPlan(data);
  }

  /**
   * Classify Cuisine
   */
  async classifyCuisine(title, ingredientList) {
    const params = new URLSearchParams({
      title: title,
      ingredientList: ingredientList,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/recipes/cuisine?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Cuisine classification error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      cuisine: data.cuisine,
      cuisines: data.cuisines,
      confidence: data.confidence
    };
  }

  /**
   * Analyze Recipe Instructions
   */
  async analyzeRecipeInstructions(instructions) {
    const params = new URLSearchParams({
      instructions: instructions,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/recipes/analyzeInstructions?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Recipe analysis error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Guess Nutrition by Dish Name
   */
  async guessNutritionByDishName(title) {
    const params = new URLSearchParams({
      title: title,
      apiKey: this.apiKey
    });

    const url = `${this.baseUrl}/recipes/guessNutrition?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Nutrition guess error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      calories: data.calories,
      carbs: data.carbs,
      fat: data.fat,
      protein: data.protein,
      confidence: data.confidence
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get mood-appropriate ingredients
   */
  getMoodIngredients(moodConfig) {
    const ingredientMap = {
      joy: ["chocolate", "vanilla", "sugar", "cream", "berries", "honey"],
      sadness: ["chicken", "potatoes", "cheese", "bread", "soup", "comfort"],
      anger: ["chili", "pepper", "garlic", "ginger", "spicy", "hot"],
      fear: ["chamomile", "ginger", "lemon", "mint", "calming", "light"],
      surprise: ["fusion", "exotic", "unusual", "adventurous", "creative"],
      disgust: ["lettuce", "cucumber", "lemon", "fresh", "clean", "detox"],
      neutral: ["pasta", "rice", "chicken", "vegetables", "balanced"]
    };
    
    return ingredientMap[moodConfig.queries[0]?.toLowerCase()] || ingredientMap.neutral;
  }

  /**
   * Get ingredient suggestions based on mood
   */
  async getIngredientSuggestions(moodConfig) {
    try {
      const suggestions = [];
      
      for (const query of moodConfig.queries.slice(0, 2)) {
        const params = new URLSearchParams({
          query: query,
          number: 5,
          apiKey: this.apiKey
        });

        const url = `${this.baseUrl}/food/ingredients/autocomplete?${params}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          suggestions.push(...data.map(item => item.name));
        }
        
        // Rate limiting
        await this.delay(this.requestDelay);
      }

      return [...new Set(suggestions)].slice(0, 10);
    } catch (error) {
      console.error("Error getting ingredient suggestions:", error);
      return [];
    }
  }

  /**
   * Analyze nutrition for multiple recipes
   */
  async analyzeNutrition(recipes) {
    try {
      const recipeIds = recipes.map(r => r.id).join(',');
      const params = new URLSearchParams({
        ids: recipeIds,
        apiKey: this.apiKey
      });

      const url = `${this.baseUrl}/recipes/informationBulk?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Nutrition analysis error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Calculate average nutrition
      const avgNutrition = this.calculateAverageNutrition(data);
      
      return avgNutrition;
    } catch (error) {
      console.error("Error analyzing nutrition:", error);
      return {};
    }
  }

  /**
   * Calculate average nutrition from multiple recipes
   */
  calculateAverageNutrition(recipes) {
    if (!recipes.length) return {};

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };

    recipes.forEach(recipe => {
      const nutrition = recipe.nutrition?.nutrients || [];
      totals.calories += nutrition.find(n => n.name === 'Calories')?.amount || 0;
      totals.protein += nutrition.find(n => n.name === 'Protein')?.amount || 0;
      totals.carbs += nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0;
      totals.fat += nutrition.find(n => n.name === 'Fat')?.amount || 0;
      totals.fiber += nutrition.find(n => n.name === 'Fiber')?.amount || 0;
      totals.sugar += nutrition.find(n => n.name === 'Sugar')?.amount || 0;
    });

    const count = recipes.length;
    return {
      calories: Math.round(totals.calories / count),
      protein: Math.round(totals.protein / count),
      carbs: Math.round(totals.carbs / count),
      fat: Math.round(totals.fat / count),
      fiber: Math.round(totals.fiber / count),
      sugar: Math.round(totals.sugar / count)
    };
  }

  /**
   * Remove duplicate recipes based on ID
   */
  removeDuplicateRecipes(recipes) {
    const seen = new Set();
    return recipes.filter(recipe => {
      if (seen.has(recipe.id)) {
        return false;
      }
      seen.add(recipe.id);
      return true;
    });
  }

  /**
   * Delay function for rate limiting
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      spoonacularScore: recipe.spoonacularScore,
      healthScore: recipe.healthScore,
      pricePerServing: recipe.pricePerServing,
      dishTypes: recipe.dishTypes || [],
      diets: recipe.diets || [],
      summary: recipe.summary
    };
  }

  /**
   * Transform detailed recipe with additional information
   */
  transformDetailedRecipe(recipe) {
    return {
      ...this.transformRecipe(recipe, 'neutral'),
      winePairing: recipe.winePairing,
      tasteData: recipe.tasteData,
      analyzedInstructions: recipe.analyzedInstructions,
      equipment: recipe.equipment,
      nutrition: recipe.nutrition,
      sourceName: recipe.sourceName,
      creditsText: recipe.creditsText
    };
  }

  /**
   * Transform meal plan data
   */
  transformMealPlan(mealPlan) {
    return {
      meals: mealPlan.meals?.map(meal => ({
        id: meal.id,
        title: meal.title,
        readyInMinutes: meal.readyInMinutes,
        servings: meal.servings,
        image: meal.image,
        imageType: meal.imageType,
        calories: meal.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0
      })) || [],
      nutrients: mealPlan.nutrients,
      week: mealPlan.week
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
    // Ensure mood is a string
    const moodString = typeof mood === 'string' ? mood : 'neutral';
    
    const benefits = {
      joy: "Boosts serotonin with natural carbs and colorful nutrients",
      sadness: "Comforting and warming, perfect for lifting spirits",
      anger: "Spicy food can help release endorphins and reduce stress",
      fear: "Gentle and soothing, helps calm nerves",
      surprise: "Exciting flavors and textures to match your enthusiasm",
      disgust: "Clean, fresh ingredients to reset your palate",
      neutral: "Balanced and nutritious for your calm state"
    };
    
    return benefits[moodString.toLowerCase()] || "Nutritious and delicious for your current mood";
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
