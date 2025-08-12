// fetchRecipes.js
import fetch from "node-fetch";
import { getPrimaryFoodQuery, getRandomFoodQuery } from "./moodToSpoonacular.js";

const API_KEY = process.env.SPOONACULAR_API_KEY;

export async function getRecipesByMood(mood, numberOfRecipes = 5) {
  if (!API_KEY) {
    throw new Error("SPOONACULAR_API_KEY environment variable is not set");
  }

  const query = getPrimaryFoodQuery(mood);
  const randomQuery = getRandomFoodQuery(mood);

  try {
    // Try primary query first
    const primaryResults = await fetchSpoonacularRecipes(query, numberOfRecipes);
    
    // If we don't get enough results, try random query
    if (primaryResults.length < numberOfRecipes) {
      const additionalResults = await fetchSpoonacularRecipes(randomQuery, numberOfRecipes - primaryResults.length);
      primaryResults.push(...additionalResults);
    }

    return {
      mood,
      primaryQuery: query,
      randomQuery,
      results: primaryResults.slice(0, numberOfRecipes),
      totalFound: primaryResults.length
    };
  } catch (error) {
    console.error(`Error fetching recipes for mood "${mood}":`, error);
    throw error;
  }
}

async function fetchSpoonacularRecipes(query, number = 5) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}&apiKey=${API_KEY}&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
}

// Enhanced recipe fetching with dietary preferences
export async function getRecipesByMoodWithPreferences(mood, preferences = {}) {
  const {
    numberOfRecipes = 5,
    cuisine = null,
    diet = null,
    intolerances = null,
    maxReadyTime = null,
    minProtein = null,
    maxCalories = null
  } = preferences;

  if (!API_KEY) {
    throw new Error("SPOONACULAR_API_KEY environment variable is not set");
  }

  const query = getPrimaryFoodQuery(mood);
  
  try {
    let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${numberOfRecipes}&apiKey=${API_KEY}&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true`;

    // Add optional parameters
    if (cuisine) url += `&cuisine=${cuisine}`;
    if (diet) url += `&diet=${diet}`;
    if (intolerances) url += `&intolerances=${intolerances}`;
    if (maxReadyTime) url += `&maxReadyTime=${maxReadyTime}`;
    if (minProtein) url += `&minProtein=${minProtein}`;
    if (maxCalories) url += `&maxCalories=${maxCalories}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      mood,
      query,
      preferences,
      results: data.results || [],
      totalFound: data.totalResults || 0
    };
  } catch (error) {
    console.error(`Error fetching recipes for mood "${mood}" with preferences:`, error);
    throw error;
  }
}

// Get recipe details by ID
export async function getRecipeDetails(recipeId) {
  if (!API_KEY) {
    throw new Error("SPOONACULAR_API_KEY environment variable is not set");
  }

  try {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe details for ID ${recipeId}:`, error);
    throw error;
  }
}
