# Mood-Based Recipe Service Setup Guide

This service integrates mood detection with Spoonacular API to provide personalized recipe recommendations based on your emotional state.

## 🚀 Quick Start

### 1. Get Your Spoonacular API Key

1. Visit [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Your API Key

**Option A: Environment Variable (Recommended)**
```bash
# Windows PowerShell
$env:SPOONACULAR_API_KEY="your_api_key_here"

# Windows Command Prompt
set SPOONACULAR_API_KEY=your_api_key_here

# Linux/Mac
export SPOONACULAR_API_KEY="your_api_key_here"
```

**Option B: .env File**
Create a `.env` file in the project root:
```env
SPOONACULAR_API_KEY=your_api_key_here
```

### 4. Test the Service

```bash
# Test basic functionality
npm test

# Run the full demonstration
npm start
```

## 🎭 Mood to Food Mapping

The service automatically maps detected moods to appropriate food categories:

| Mood | Primary Query | Alternative Queries |
|------|---------------|-------------------|
| **joy** | dessert | sweet treats, celebration food, colorful dishes |
| **sadness** | comfort food | warm soup, chocolate, homemade bread |
| **anger** | spicy food | hot sauce, chili, fiery dishes |
| **fear** | soothing soup | calming tea, gentle flavors, easy recipes |
| **surprise** | fusion cuisine | exotic dishes, unusual combinations |
| **disgust** | light salad | fresh ingredients, clean eating |
| **neutral** | pasta | balanced meals, classic dishes |

## 🍽️ API Endpoints

### Mood Detection (FastAPI)
- `POST /detect-mood` - Analyze text for mood
- `GET /health` - Service health check

### Recipe Fetching (Node.js)
- `getRecipesByMood(mood, count)` - Get recipes for a mood
- `getRecipesByMoodWithPreferences(mood, preferences)` - With dietary restrictions

## 🔧 Usage Examples

### Basic Recipe Fetching
```javascript
import { getRecipesByMood } from './fetchRecipes.js';

const recipes = await getRecipesByMood('sadness', 5);
console.log(recipes.results);
```

### With Dietary Preferences
```javascript
import { getRecipesByMoodWithPreferences } from './fetchRecipes.js';

const preferences = {
  numberOfRecipes: 3,
  cuisine: 'italian',
  diet: 'vegetarian',
  maxReadyTime: 30
};

const recipes = await getRecipesByMoodWithPreferences('sadness', preferences);
```

## 🧪 Testing

Run the test suite to verify everything works:
```bash
npm test
```

This will test:
- API key validation
- Mood-to-food mapping
- Recipe fetching for different moods
- Error handling

## 🚨 Troubleshooting

### Common Issues

1. **"SPOONACULAR_API_KEY not set"**
   - Make sure you've set the environment variable
   - Check if you're in the right terminal session

2. **"Unable to connect to remote server"**
   - Check your internet connection
   - Verify the API key is correct
   - Check Spoonacular service status

3. **"API error: 402 Payment Required"**
   - Free tier has daily limits
   - Check your usage at Spoonacular dashboard

### Rate Limiting

- Free tier: 150 requests/day
- Paid tiers: Higher limits available
- Consider caching results for development

## 🔗 Integration with Frontend

The service is designed to work with your React frontend:

1. **Mood Detection**: FastAPI service analyzes text
2. **Recipe Fetching**: Node.js service gets Spoonacular recipes
3. **Frontend Display**: React shows personalized recommendations

## 📚 Next Steps

1. ✅ Set up API key
2. ✅ Test basic functionality
3. 🔄 Integrate with your React frontend
4. 🎨 Customize mood-to-food mappings
5. 🚀 Deploy to production

## 🆘 Support

- [Spoonacular API Documentation](https://spoonacular.com/food-api/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
