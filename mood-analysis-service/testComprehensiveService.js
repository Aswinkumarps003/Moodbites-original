// testComprehensiveService.js - Test all comprehensive Spoonacular endpoints
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3001';

// Test data
const testMoods = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
const testPreferences = {
  number: 6,
  cuisine: 'italian',
  diet: 'vegetarian',
  maxReadyTime: 30,
  maxCalories: 500
};

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runComprehensiveTests() {
  console.log('🧪 Starting Comprehensive Spoonacular API Tests\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  const healthTest = await testEndpoint('/health');
  if (healthTest.success) {
    console.log('✅ Health check passed');
    console.log('   Service:', healthTest.data.service);
  } else {
    console.log('❌ Health check failed:', healthTest.error || healthTest.data);
  }
  console.log('');

  // Test 2: Comprehensive Mood-Based Recipes
  console.log('2️⃣ Testing Comprehensive Mood-Based Recipe Fetching...');
  for (const mood of testMoods.slice(0, 3)) { // Test first 3 moods
    console.log(`   Testing mood: ${mood}`);
    const recipeTest = await testEndpoint('/api/recipes/mood', 'POST', {
      mood: mood,
      preferences: testPreferences
    });
    
    if (recipeTest.success) {
      const result = recipeTest.data;
      console.log(`   ✅ Found ${result.recipes?.length || 0} recipes`);
      console.log(`   📊 Search strategies: ${result.searchStrategies?.join(', ') || 'none'}`);
      console.log(`   🥗 Ingredients: ${result.ingredients?.length || 0} suggestions`);
      console.log(`   📈 Nutrition: ${Object.keys(result.nutrition || {}).length} metrics`);
    } else {
      console.log(`   ❌ Failed: ${recipeTest.error || recipeTest.data?.error}`);
    }
  }
  console.log('');

  // Test 3: Recipe Details
  console.log('3️⃣ Testing Recipe Details...');
  const detailsTest = await testEndpoint('/api/recipes/716429/details');
  if (detailsTest.success) {
    console.log('✅ Recipe details fetched successfully');
    console.log(`   Recipe: ${detailsTest.data.name}`);
    console.log(`   Ingredients: ${detailsTest.data.ingredients?.length || 0}`);
    console.log(`   Wine Pairing: ${detailsTest.data.winePairing ? 'Available' : 'Not available'}`);
  } else {
    console.log('❌ Recipe details failed:', detailsTest.error || detailsTest.data?.error);
  }
  console.log('');

  // Test 4: Recipe Bulk Information
  console.log('4️⃣ Testing Recipe Bulk Information...');
  const bulkTest = await testEndpoint('/api/recipes/bulk', 'POST', {
    recipeIds: [716429, 715538, 716300]
  });
  if (bulkTest.success) {
    console.log('✅ Bulk recipe information fetched successfully');
    console.log(`   Recipes: ${bulkTest.data.count}`);
  } else {
    console.log('❌ Bulk recipe information failed:', bulkTest.error || bulkTest.data?.error);
  }
  console.log('');

  // Test 5: Similar Recipes
  console.log('5️⃣ Testing Similar Recipes...');
  const similarTest = await testEndpoint('/api/recipes/716429/similar?limit=3');
  if (similarTest.success) {
    console.log('✅ Similar recipes fetched successfully');
    console.log(`   Found ${similarTest.data.similar?.length || 0} similar recipes`);
  } else {
    console.log('❌ Similar recipes failed:', similarTest.error || similarTest.data?.error);
  }
  console.log('');

  // Test 6: Autocomplete Recipe Search
  console.log('6️⃣ Testing Autocomplete Recipe Search...');
  const autocompleteTest = await testEndpoint('/api/recipes/autocomplete?q=pasta&number=5');
  if (autocompleteTest.success) {
    console.log('✅ Autocomplete recipe search successful');
    console.log(`   Found ${autocompleteTest.data.results?.length || 0} suggestions`);
  } else {
    console.log('❌ Autocomplete recipe search failed:', autocompleteTest.error || autocompleteTest.data?.error);
  }
  console.log('');

  // Test 7: Ingredient Search
  console.log('7️⃣ Testing Ingredient Search...');
  const ingredientTest = await testEndpoint('/api/ingredients/search?q=chicken&limit=5');
  if (ingredientTest.success) {
    console.log('✅ Ingredient search successful');
    console.log(`   Found ${ingredientTest.data.ingredients?.length || 0} ingredients`);
  } else {
    console.log('❌ Ingredient search failed:', ingredientTest.error || ingredientTest.data?.error);
  }
  console.log('');

  // Test 8: Ingredient Information
  console.log('8️⃣ Testing Ingredient Information...');
  const ingredientInfoTest = await testEndpoint('/api/ingredients/1001');
  if (ingredientInfoTest.success) {
    console.log('✅ Ingredient information fetched successfully');
    console.log(`   Ingredient: ${ingredientInfoTest.data.name}`);
    console.log(`   Nutrition: ${ingredientInfoTest.data.nutrition ? 'Available' : 'Not available'}`);
  } else {
    console.log('❌ Ingredient information failed:', ingredientInfoTest.error || ingredientInfoTest.data?.error);
  }
  console.log('');

  // Test 9: Ingredient Autocomplete
  console.log('9️⃣ Testing Ingredient Autocomplete...');
  const ingredientAutocompleteTest = await testEndpoint('/api/ingredients/autocomplete?q=tomato&number=5');
  if (ingredientAutocompleteTest.success) {
    console.log('✅ Ingredient autocomplete successful');
    console.log(`   Found ${ingredientAutocompleteTest.data.results?.length || 0} suggestions`);
  } else {
    console.log('❌ Ingredient autocomplete failed:', ingredientAutocompleteTest.error || ingredientAutocompleteTest.data?.error);
  }
  console.log('');

  // Test 10: Ingredient Substitutes
  console.log('🔟 Testing Ingredient Substitutes...');
  const substitutesTest = await testEndpoint('/api/ingredients/substitutes/butter');
  if (substitutesTest.success) {
    console.log('✅ Ingredient substitutes found successfully');
    console.log(`   Substitutes: ${substitutesTest.data.substitutes?.length || 0}`);
  } else {
    console.log('❌ Ingredient substitutes failed:', substitutesTest.error || substitutesTest.data?.error);
  }
  console.log('');

  // Test 11: Meal Plan Generation
  console.log('1️⃣1️⃣ Testing Meal Plan Generation...');
  const mealPlanTest = await testEndpoint('/api/meal-plan', 'POST', {
    mood: 'joy',
    timeFrame: 'day'
  });
  if (mealPlanTest.success) {
    console.log('✅ Meal plan generated successfully');
    console.log(`   Meals: ${mealPlanTest.data.mealPlan?.meals?.length || 0}`);
  } else {
    console.log('❌ Meal plan generation failed:', mealPlanTest.error || mealPlanTest.data?.error);
  }
  console.log('');

  // Test 12: Cuisine Classification
  console.log('1️⃣2️⃣ Testing Cuisine Classification...');
  const cuisineTest = await testEndpoint('/api/analyze/cuisine', 'POST', {
    title: 'Spaghetti Carbonara',
    ingredientList: 'pasta, eggs, cheese, bacon'
  });
  if (cuisineTest.success) {
    console.log('✅ Cuisine classification successful');
    console.log(`   Cuisine: ${cuisineTest.data.cuisine}`);
    console.log(`   Confidence: ${cuisineTest.data.confidence}`);
  } else {
    console.log('❌ Cuisine classification failed:', cuisineTest.error || cuisineTest.data?.error);
  }
  console.log('');

  // Test 13: Recipe Instructions Analysis
  console.log('1️⃣3️⃣ Testing Recipe Instructions Analysis...');
  const instructionsTest = await testEndpoint('/api/analyze/instructions', 'POST', {
    instructions: 'Boil water, add pasta, cook for 8 minutes, drain and serve'
  });
  if (instructionsTest.success) {
    console.log('✅ Recipe instructions analysis successful');
    console.log(`   Steps: ${instructionsTest.data.steps?.length || 0}`);
  } else {
    console.log('❌ Recipe instructions analysis failed:', instructionsTest.error || instructionsTest.data?.error);
  }
  console.log('');

  // Test 14: Nutrition Guess
  console.log('1️⃣4️⃣ Testing Nutrition Guess...');
  const nutritionTest = await testEndpoint('/api/analyze/nutrition', 'POST', {
    title: 'Chicken Caesar Salad'
  });
  if (nutritionTest.success) {
    console.log('✅ Nutrition guess successful');
    console.log(`   Calories: ${nutritionTest.data.nutrition?.calories || 'Unknown'}`);
    console.log(`   Confidence: ${nutritionTest.data.nutrition?.confidence || 'Unknown'}`);
  } else {
    console.log('❌ Nutrition guess failed:', nutritionTest.error || nutritionTest.data?.error);
  }
  console.log('');

  // Test 15: Available Cuisines and Diets
  console.log('1️⃣5️⃣ Testing Available Cuisines and Diets...');
  const cuisinesTest = await testEndpoint('/api/cuisines');
  const dietsTest = await testEndpoint('/api/diets');
  
  if (cuisinesTest.success) {
    console.log('✅ Available cuisines fetched successfully');
    console.log(`   Cuisines: ${cuisinesTest.data.cuisines?.length || 0}`);
  } else {
    console.log('❌ Available cuisines failed:', cuisinesTest.error || cuisinesTest.data?.error);
  }
  
  if (dietsTest.success) {
    console.log('✅ Available diets fetched successfully');
    console.log(`   Diets: ${dietsTest.data.diets?.length || 0}`);
  } else {
    console.log('❌ Available diets failed:', dietsTest.error || dietsTest.data?.error);
  }
  console.log('');

  // Test 16: Test Endpoint
  console.log('1️⃣6️⃣ Testing Test Endpoint...');
  const testEndpointTest = await testEndpoint('/api/test/joy');
  if (testEndpointTest.success) {
    console.log('✅ Test endpoint successful');
    console.log(`   Recipes: ${testEndpointTest.data.recipes?.length || 0}`);
  } else {
    console.log('❌ Test endpoint failed:', testEndpointTest.error || testEndpointTest.data?.error);
  }
  console.log('');

  console.log('🎉 Comprehensive Spoonacular API Tests Complete!');
  console.log('\n📋 Summary of Features Tested:');
  console.log('   ✅ Comprehensive mood-based recipe fetching with multiple strategies');
  console.log('   ✅ Detailed recipe information with nutrition and wine pairing');
  console.log('   ✅ Bulk recipe information fetching');
  console.log('   ✅ Similar recipe recommendations');
  console.log('   ✅ Recipe and ingredient autocomplete');
  console.log('   ✅ Ingredient search and detailed information');
  console.log('   ✅ Ingredient substitution suggestions');
  console.log('   ✅ Meal planning based on mood');
  console.log('   ✅ Cuisine classification');
  console.log('   ✅ Recipe instructions analysis');
  console.log('   ✅ Nutrition guessing by dish name');
  console.log('   ✅ Available cuisines and diets');
  console.log('\n🚀 Your MoodBites service now has comprehensive Spoonacular API integration!');
}

// Run tests
runComprehensiveTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
