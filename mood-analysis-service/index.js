// index.js - Main integration script for mood-based recipe recommendations
import { getRecipesByMood, getRecipesByMoodWithPreferences } from "./fetchRecipes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Example usage function
async function demonstrateMoodBasedRecipes() {
  console.log("🍽️  MoodBites Recipe Recommendation Service");
  console.log("=" .repeat(50));
  
  // Test different moods
  const testMoods = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "neutral"];
  
  for (const mood of testMoods) {
    try {
      console.log(`\n🎭 Testing mood: ${mood.toUpperCase()}`);
      console.log("-".repeat(30));
      
      const recipes = await getRecipesByMood(mood, 3);
      
      console.log(`📍 Search query: ${recipes.primaryQuery}`);
      console.log(`🔍 Alternative query: ${recipes.randomQuery}`);
      console.log(`📊 Found ${recipes.totalFound} recipes`);
      
      if (recipes.results.length > 0) {
        console.log("\n🍳 Top recipes:");
        recipes.results.forEach((recipe, index) => {
          console.log(`  ${index + 1}. ${recipe.title}`);
          console.log(`     ⏱️  Ready in: ${recipe.readyInMinutes} minutes`);
          console.log(`     👥 Servings: ${recipe.servings}`);
          console.log(`     ⭐ Rating: ${recipe.spoonacularScore || 'N/A'}/100`);
        });
      }
      
    } catch (error) {
      console.error(`❌ Error for mood "${mood}":`, error.message);
    }
  }
}

// Test with dietary preferences
async function demonstrateWithPreferences() {
  console.log("\n\n🥗 Testing with dietary preferences");
  console.log("=" .repeat(50));
  
  try {
    const preferences = {
      numberOfRecipes: 3,
      cuisine: "italian",
      diet: "vegetarian",
      maxReadyTime: 30,
      maxCalories: 500
    };
    
    console.log("📋 Preferences:", preferences);
    
    const recipes = await getRecipesByMoodWithPreferences("sadness", preferences);
    
    console.log(`\n🍝 Comfort food recipes (Italian, Vegetarian, <30min, <500cal):`);
    recipes.results.forEach((recipe, index) => {
      console.log(`  ${index + 1}. ${recipe.title}`);
      console.log(`     ⏱️  Ready in: ${recipe.readyInMinutes} minutes`);
      console.log(`     🔥 Calories: ${recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 'N/A'}`);
    });
    
  } catch (error) {
    console.error("❌ Error with preferences:", error.message);
  }
}

// Main execution
async function main() {
  try {
    // Check if API key is set
    if (!process.env.SPOONACULAR_API_KEY) {
      console.error("❌ SPOONACULAR_API_KEY environment variable is not set!");
      console.log("\n📝 To set it up:");
      console.log("1. Get your API key from: https://spoonacular.com/food-api");
      console.log("2. Create a .env file with: SPOONACULAR_API_KEY=your_key_here");
      console.log("3. Or set it in PowerShell: $env:SPOONACULAR_API_KEY='your_key_here'");
      return;
    }
    
    console.log("✅ Spoonacular API key found!");
    
    // Run demonstrations
    await demonstrateMoodBasedRecipes();
    await demonstrateWithPreferences();
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Main execution error:", error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
