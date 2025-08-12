# 🍽️ MoodBites Integration Guide

## 🎯 **Complete System Overview**

Your MoodBites app now has a **complete integration** between:
1. **Mood Detection** (FastAPI + Hugging Face)
2. **Recipe Fetching** (Express + Spoonacular API)
3. **Frontend Display** (React with real-time updates)

## 🚀 **How It Works**

### **1. User Experience Flow**
```
User types: "I'm feeling really stressed about work"
    ↓
FastAPI detects: "fear" (anxiety)
    ↓
Express service maps: "fear" → "soothing soup"
    ↓
Spoonacular returns: Real recipes matching the mood
    ↓
React displays: Personalized food recommendations
```

### **2. Service Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Express Server  │    │  Spoonacular    │
│  (Frontend)     │◄──►│   (Port 3001)    │◄──►│     API         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  FastAPI Mood   │    │   Recipe Service │
│  Detection      │    │   (Port 8000)    │
└─────────────────┘    └──────────────────┘
```

## 🔧 **Setup Instructions**

### **Step 1: Get Your Spoonacular API Key**
1. Visit [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Sign up for a free account (150 requests/day)
3. Copy your API key

### **Step 2: Set Your API Key**
```powershell
# In PowerShell
$env:SPOONACULAR_API_KEY="your_actual_api_key_here"
```

### **Step 3: Start the Services**

**Option A: Use the Batch File (Windows)**
```bash
# Double-click or run:
start-services.bat
```

**Option B: Manual Start**
```bash
# Terminal 1 - Mood Detection Service
python app.py

# Terminal 2 - Recipe Service  
npm start

# Terminal 3 - React Frontend (from frontend directory)
npm run dev
```

## 🎭 **Mood-to-Food Mapping**

The system automatically maps detected moods to appropriate food categories:

| Mood | Food Category | Cuisine | Type | Max Time | Max Calories |
|------|---------------|---------|------|----------|--------------|
| **joy** | dessert | american | dessert | 60 min | 600 cal |
| **sadness** | comfort food | italian | main course | 45 min | 800 cal |
| **anger** | spicy food | thai | main course | 40 min | 700 cal |
| **fear** | soothing soup | mediterranean | soup | 30 min | 400 cal |
| **surprise** | fusion cuisine | japanese | main course | 50 min | 600 cal |
| **disgust** | light salad | mediterranean | salad | 20 min | 300 cal |
| **neutral** | pasta | italian | main course | 35 min | 500 cal |

## 🍽️ **API Endpoints**

### **Mood Detection (FastAPI - Port 8000)**
- `POST /detect-mood` - Analyze text for mood
- `GET /health` - Service health check

### **Recipe Service (Express - Port 3001)**
- `POST /api/recipes/mood` - Get recipes by mood
- `GET /api/cuisines` - Available cuisines
- `GET /api/diets` - Available diets
- `GET /health` - Service health check

### **Frontend Integration**
- **Mood Input**: Text analysis or manual selection
- **Recipe Fetching**: Real-time API calls
- **Preferences**: Cuisine, cooking time, calories
- **Fallback**: Mock data if API fails

## 🔍 **Testing the Integration**

### **1. Test Mood Detection**
```bash
curl -X POST "http://localhost:8000/detect-mood" \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling really happy today!"}'
```

### **2. Test Recipe Service**
```bash
curl -X POST "http://localhost:3001/api/recipes/mood" \
  -H "Content-Type: application/json" \
  -d '{"mood": "joy", "preferences": {"number": 3}}'
```

### **3. Test Frontend**
1. Open [http://localhost:5173](http://localhost:5173)
2. Type: "I'm feeling sad and need comfort"
3. Watch real recipes appear!

## 🎨 **Frontend Features**

### **Enhanced Recipe Cards**
- **Real images** from Spoonacular
- **Nutrition info** (calories, protein, carbs, fat)
- **Cooking time** and servings
- **Spoonacular score** for quality
- **Mood-specific benefits**

### **Preference Controls**
- **Cuisine selection** (Italian, Thai, Mediterranean, etc.)
- **Cooking time** (Quick ≤15min, Fast ≤30min, etc.)
- **Calorie limits** (Light ≤300cal, Moderate ≤500cal, etc.)

### **Smart Fallbacks**
- **API failure handling** with mock data
- **Loading states** with animations
- **Error messages** with user guidance

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"SPOONACULAR_API_KEY not set"**
   - Set your API key: `$env:SPOONACULAR_API_KEY="your_key"`
   - Service will use mock data as fallback

2. **"Connection refused"**
   - Make sure both services are running
   - Check ports 8000 and 3001 are available

3. **"401 Unauthorized"**
   - Verify your Spoonacular API key is correct
   - Check your daily API limit (150 requests/day free)

4. **Frontend not updating**
   - Check browser console for errors
   - Verify CORS is enabled on both services

### **Service Status Check**
```bash
# Check mood detection service
curl http://localhost:8000/health

# Check recipe service
curl http://localhost:3001/health
```

## 🎯 **What You Get**

✅ **Real recipes** from Spoonacular (not mock data)  
✅ **Mood-appropriate** food suggestions  
✅ **Dietary preferences** support  
✅ **Complete nutrition** information  
✅ **Professional API** integration  
✅ **Smart fallbacks** for reliability  
✅ **Beautiful UI** with loading states  
✅ **Real-time updates** based on preferences  

## 🚀 **Next Steps**

1. **✅ Set up API key**
2. **✅ Start both services**
3. **✅ Test the integration**
4. **🔄 Customize mood mappings**
5. **🎨 Add more preferences**
6. **🚀 Deploy to production**

## 🆘 **Support**

- **Spoonacular API**: [https://spoonacular.com/food-api/docs](https://spoonacular.com/food-api/docs)
- **FastAPI**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Express**: [https://expressjs.com/](https://expressjs.com/)
- **React**: [https://reactjs.org/](https://reactjs.org/)

---

**🎉 Congratulations! You now have a complete mood-based recipe recommendation system!**

The foundation is complete - now enjoy real recipes that match your emotions! 🍽️✨
