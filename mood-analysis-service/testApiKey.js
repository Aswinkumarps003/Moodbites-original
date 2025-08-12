// testApiKey.js - Simple API key test
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testApiKey() {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  
  console.log("🔑 Testing Spoonacular API Key");
  console.log("=" .repeat(40));
  
  if (!apiKey) {
    console.error("❌ No API key found!");
    console.log("\n📝 To fix this:");
    console.log("1. Get your API key from: https://spoonacular.com/food-api");
    console.log("2. Set it: $env:SPOONACULAR_API_KEY='your_key_here'");
    return;
  }
  
  console.log(`✅ API key found: ${apiKey.substring(0, 8)}...`);
  
  try {
    // Test with a simple search
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=1&apiKey=${apiKey}`;
    
    console.log("\n🌐 Testing API connection...");
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ API connection successful!");
      console.log(`📊 Found ${data.totalResults} recipes`);
      
      if (data.results && data.results.length > 0) {
        const recipe = data.results[0];
        console.log(`\n🍝 Sample recipe: ${recipe.title}`);
        console.log(`   ⏱️  Ready in: ${recipe.readyInMinutes} minutes`);
        console.log(`   👥 Servings: ${recipe.servings}`);
      }
      
    } else {
      console.error(`❌ API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.log("\n🔍 This means your API key is invalid or expired.");
        console.log("   Please check your key at: https://spoonacular.com/food-api");
      }
    }
    
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
}

// Run the test
testApiKey();
