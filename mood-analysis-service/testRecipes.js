// testRecipes.js - Test script for recipe fetching functionality
import { getRecipesByMood } from "./fetchRecipes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testSingleMood(mood) {
  console.log(`\n🧪 Testing mood: ${mood.toUpperCase()}`);
  console.log("-".repeat(40));
  
  try {
    const recipes = await getRecipesByMood(mood, 2);
    
    console.log(`✅ Success! Found ${recipes.results.length} recipes`);
    console.log(`🔍 Primary query: ${recipes.primaryQuery}`);
    console.log(`🔍 Alternative query: ${recipes.randomQuery}`);
    
    if (recipes.results.length > 0) {
      const recipe = recipes.results[0];
      console.log(`\n🍳 Sample recipe: ${recipe.title}`);
      console.log(`   📸 Image: ${recipe.image ? 'Available' : 'Not available'}`);
      console.log(`   ⏱️  Ready in: ${recipe.readyInMinutes} minutes`);
      console.log(`   👥 Servings: ${recipe.servings}`);
      console.log(`   🔗 ID: ${recipe.id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed for mood "${mood}":`, error.message);
    return false;
  }
}

async function runTests() {
  console.log("🧪 Recipe Fetching Test Suite");
  console.log("=" .repeat(50));
  
  // Check API key
  if (!process.env.SPOONACULAR_API_KEY) {
    console.error("❌ SPOONACULAR_API_KEY not found!");
    console.log("\n📝 Please set your Spoonacular API key:");
    console.log("1. Get it from: https://spoonacular.com/food-api");
    console.log("2. Set it: $env:SPOONACULAR_API_KEY='your_key_here'");
    console.log("3. Or create a .env file");
    return;
  }
  
  console.log("✅ API key found");
  
  // Test moods
  const testMoods = ["joy", "sadness", "anger"];
  let successCount = 0;
  
  for (const mood of testMoods) {
    const success = await testSingleMood(mood);
    if (success) successCount++;
    
    // Wait a bit between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Test Results: ${successCount}/${testMoods.length} passed`);
  
  if (successCount === testMoods.length) {
    console.log("🎉 All tests passed! Recipe service is working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Check the error messages above.");
  }
}

// Run tests
runTests().catch(console.error);
