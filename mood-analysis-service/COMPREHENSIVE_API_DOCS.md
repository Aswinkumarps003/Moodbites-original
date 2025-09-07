# Comprehensive MoodBites Recipe Service

## 🚀 Overview

This enhanced MoodBites Recipe Service provides comprehensive Spoonacular API integration with multiple search strategies for mood-based recipe recommendations. It includes extensive endpoints for recipes, ingredients, meal planning, and analysis.

## 📋 Features

### 🍽️ Recipe Endpoints
- **Comprehensive Mood-Based Recipes**: Multiple search strategies per mood
- **Recipe Details**: Detailed information with nutrition, wine pairing, taste data
- **Bulk Recipe Information**: Fetch multiple recipes at once
- **Similar Recipes**: Get recommendations based on existing recipes
- **Autocomplete Recipe Search**: Real-time recipe suggestions

### 🥗 Ingredient Endpoints
- **Ingredient Search**: Search for ingredients with detailed information
- **Ingredient Information**: Get detailed nutrition and usage data
- **Ingredient Autocomplete**: Real-time ingredient suggestions
- **Ingredient Substitutes**: Find alternatives for ingredients

### 📅 Meal Planning
- **Generate Meal Plans**: Create meal plans based on mood and preferences
- **Time Frame Support**: Daily, weekly meal planning

### 🔍 Analysis Features
- **Cuisine Classification**: Identify cuisine type from recipe title and ingredients
- **Recipe Instructions Analysis**: Analyze and structure recipe steps
- **Nutrition Guessing**: Estimate nutrition from dish name

## 🔧 Setup

### 1. Install Dependencies
```bash
cd mood-analysis-service
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
PORT=3001
```

### 3. Start the Service
```bash
npm start
# or with auto-reload
npm run dev
```

## 📡 API Endpoints

### Core Recipe Endpoints

#### POST `/api/recipes/mood`
Get comprehensive recipes based on mood using multiple search strategies.

**Request Body:**
```json
{
  "mood": "joy|sadness|anger|fear|surprise|disgust|neutral",
  "preferences": {
    "cuisine": "italian",
    "diet": "vegetarian",
    "maxReadyTime": 30,
    "maxCalories": 500,
    "number": 12
  }
}
```

**Response:**
```json
{
  "mood": "joy",
  "moodDescription": "Feeling happy and energetic...",
  "foodCategory": "dessert",
  "recipes": [...],
  "ingredients": ["chocolate", "vanilla", "sugar"],
  "nutrition": {
    "calories": 450,
    "protein": 15,
    "carbs": 60,
    "fat": 18
  },
  "totalFound": 25,
  "searchStrategies": ["complexSearch", "randomRecipes", "findByIngredients", "searchByNutrients"]
}
```

#### GET `/api/recipes/:id/details`
Get detailed recipe information with nutrition, wine pairing, and taste data.

#### POST `/api/recipes/bulk`
Get detailed information for multiple recipes at once.

**Request Body:**
```json
{
  "recipeIds": [716429, 715538, 716300]
}
```

#### GET `/api/recipes/:id/similar`
Get similar recipes based on a recipe ID.

#### GET `/api/recipes/autocomplete`
Autocomplete recipe search.

**Query Parameters:**
- `q`: Search query
- `number`: Number of results (default: 10)

### Ingredient Endpoints

#### GET `/api/ingredients/search`
Search for ingredients with detailed information.

**Query Parameters:**
- `q`: Search query
- `limit`: Number of results (default: 10)

#### GET `/api/ingredients/:id`
Get detailed ingredient information.

#### GET `/api/ingredients/autocomplete`
Autocomplete ingredient search.

#### GET `/api/ingredients/substitutes/:name`
Find substitutes for an ingredient.

### Meal Planning

#### POST `/api/meal-plan`
Generate meal plan based on mood.

**Request Body:**
```json
{
  "mood": "joy",
  "timeFrame": "day"
}
```

### Analysis Endpoints

#### POST `/api/analyze/cuisine`
Classify cuisine from recipe title and ingredients.

**Request Body:**
```json
{
  "title": "Spaghetti Carbonara",
  "ingredientList": "pasta, eggs, cheese, bacon"
}
```

#### POST `/api/analyze/instructions`
Analyze recipe instructions.

#### POST `/api/analyze/nutrition`
Guess nutrition from dish name.

### Utility Endpoints

#### GET `/api/cuisines`
Get available cuisines.

#### GET `/api/diets`
Get available diets.

#### GET `/api/test/:mood`
Test endpoint with sample mood.

## 🔍 Search Strategies

Each mood uses multiple search strategies for comprehensive results:

1. **Complex Search**: Primary Spoonacular search with filters
2. **Random Recipes**: For variety and discovery
3. **Find by Ingredients**: Based on mood-appropriate ingredients
4. **Search by Nutrients**: Based on mood-specific nutritional needs

## 🎯 Usage Examples

### Get Comprehensive Recipes for Joy Mood
```bash
curl -X POST http://localhost:3001/api/recipes/mood \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "joy",
    "preferences": {
      "number": 6,
      "cuisine": "italian",
      "diet": "vegetarian"
    }
  }'
```

### Search Ingredients
```bash
curl "http://localhost:3001/api/ingredients/search?q=chicken&limit=5"
```

### Get Recipe Details
```bash
curl "http://localhost:3001/api/recipes/716429/details"
```

### Generate Meal Plan
```bash
curl -X POST http://localhost:3001/api/meal-plan \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "joy",
    "timeFrame": "day"
  }'
```

### Classify Cuisine
```bash
curl -X POST http://localhost:3001/api/analyze/cuisine \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spaghetti Carbonara",
    "ingredientList": "pasta, eggs, cheese, bacon"
  }'
```

## 🧪 Testing

### Test All Endpoints
```bash
npm run test-comprehensive
```

### Test Specific Mood
```bash
curl "http://localhost:3001/api/test/joy"
```

### Health Check
```bash
curl "http://localhost:3001/health"
```

## 📊 Response Format

### Enhanced Recipe Response
Each mood-based request returns:
- **Multiple recipes** from different search strategies
- **Ingredient suggestions** based on mood
- **Nutrition analysis** with average values
- **Search strategy information**
- **Comprehensive metadata**

### Recipe Object Structure
```json
{
  "id": 716429,
  "name": "Pasta with Garlic and Oil",
  "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
  "calories": 400,
  "protein": "15g",
  "carbs": "60g",
  "fats": "12g",
  "moodBenefit": "Perfect for your current mood",
  "cuisine": "italian",
  "time": "lunch",
  "readyInMinutes": 25,
  "servings": 4,
  "instructions": "...",
  "ingredients": [...],
  "sourceUrl": "...",
  "spoonacularScore": 85,
  "healthScore": 78,
  "pricePerServing": 1.25,
  "dishTypes": ["main course"],
  "diets": ["vegetarian"],
  "summary": "..."
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Spoonacular API Errors**
   - Verify API key is correct
   - Check rate limits
   - Ensure sufficient API credits

2. **Service Not Starting**
   - Check if port 3001 is available
   - Verify environment variables
   - Check console for error messages

3. **No Recipes Found**
   - Check API key configuration
   - Verify Spoonacular API credits
   - Check network connectivity

### Debug Commands
```bash
# Check service health
curl http://localhost:3001/health

# Test specific mood
curl http://localhost:3001/api/test/joy

# Check API documentation
curl http://localhost:3001/
```

## 📈 Performance Tips

1. **Rate Limiting**: Built-in delays between API calls
2. **Caching**: Consider implementing Redis for frequently accessed data
3. **Batch Operations**: Use bulk endpoints for multiple operations
4. **Error Handling**: Graceful fallbacks to mock data when APIs fail

## 🔐 Security Notes

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure CORS properly for production
3. **Rate Limits**: Respect Spoonacular API rate limits
4. **Input Validation**: All endpoints validate input parameters

## 📚 Additional Resources

- [Spoonacular API Documentation](https://spoonacular.com/food-api/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

🎉 **Your MoodBites service now has comprehensive Spoonacular API integration with multiple search strategies, ingredient management, meal planning, and analysis features!**
