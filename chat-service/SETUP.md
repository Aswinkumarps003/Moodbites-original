# 🤖 MoodBites Chatbot Service Setup Guide

## 🎯 **What This Service Does**

The **MoodBites Chatbot Service** is the **brain** of your food recommendation system! It:

1. **🎭 Detects user mood** from text input
2. **🍽️ Fetches mood-appropriate recipes** from Spoonacular
3. **🤖 Generates intelligent responses** using OpenAI GPT
4. **💬 Provides warm, empathetic support** with food suggestions

## 🔑 **API Keys You Need**

### **1. OpenAI API Key (Required for AI responses)**
- Visit: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Sign up/login to OpenAI
- Create a new API key
- **Cost**: Very cheap (~$0.002 per 1K tokens)

### **2. Spoonacular API Key (Already set up)**
- You already have this in your `mood-analysis-service`
- Used for fetching real recipes

## 🔧 **Setup Instructions**

### **Step 1: Install Dependencies**
```bash
cd chat-service
npm install
```

### **Step 2: Set Your OpenAI API Key**

**Option A: Environment Variable (Recommended)**
```powershell
# In PowerShell
$env:OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
```

**Option B: Create .env File**
```bash
# Create .env file in chat-service folder
echo "OPENAI_API_KEY=sk-your-actual-openai-api-key-here" > .env
```

**Option C: Set in Windows System Variables**
1. Search "Environment Variables" in Windows
2. Add new variable: `OPENAI_API_KEY`
3. Value: `sk-your-actual-openai-api-key-here`

### **Step 3: Start All Services**

**Option A: Use the Updated Batch File**
```bash
# From mood-analysis-service folder
start-services.bat
```

**Option B: Manual Start (3 terminals)**
```bash
# Terminal 1 - Mood Detection Service
cd mood-analysis-service
python app.py

# Terminal 2 - Recipe Service
cd mood-analysis-service
npm start

# Terminal 3 - Chatbot Service
cd chat-service
npm start

# Terminal 4 - React Frontend
cd frontend
npm run dev
```

## 🚀 **Service Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Chatbot Service │    │     OpenAI      │
│  (Frontend)     │◄──►│   (Port 3002)    │◄──►│      GPT        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  FastAPI Mood   │    │  Express Recipe  │
│  Detection      │    │     Service      │
│  (Port 8000)    │    │   (Port 3001)    │
└─────────────────┘    └──────────────────┘
```

## 🎭 **Complete Flow Example**

### **User Input:**
> "I'm feeling really anxious about my presentation tomorrow"

### **Backend Processing:**
1. **Mood Detection** → `fear` (anxiety)
2. **Recipe Fetch** → `soothing soup`, `calming tea`
3. **AI Response** → Warm, empathetic reply with food suggestions

### **Chatbot Response:**
> "I hear you, and presentation anxiety is totally normal! 🌸 When your nerves are on edge, gentle, soothing foods can help calm your system. I'd recommend trying a **warm soothing soup** - it's like a comforting hug for your stomach. A **calming herbal tea** might also help settle those butterflies. What sounds most appealing to you right now?"

## 🔍 **Testing the Service**

### **1. Health Check**
```bash
curl http://localhost:3002/health
```

### **2. Test Complete Flow**
```bash
curl -X POST "http://localhost:3002/api/complete-flow" \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "I feel sad today"}'
```

### **3. Test Simple Chat**
```bash
curl -X POST "http://localhost:3002/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "I need comfort food", "mood": "sadness"}'
```

### **4. Run Full Test Suite**
```bash
cd chat-service
npm test
```

## 🌐 **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api/chat` | POST | Simple chat with mood + recipes |
| `/api/complete-flow` | POST | Full mood→recipe→chat flow |
| `/api/test` | GET | Test chatbot responses |

## 💰 **Cost Estimation**

### **OpenAI API Costs (GPT-4o-mini)**
- **Input tokens**: ~100-200 per request
- **Output tokens**: ~100-150 per response
- **Total per chat**: ~250-350 tokens
- **Cost per chat**: ~$0.0005-0.0007
- **1000 chats**: ~$0.50-0.70

### **Spoonacular API Costs**
- **Free tier**: 150 requests/day
- **Paid tier**: $10/month for 1,500 requests

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"OPENAI_API_KEY not set"**
   - Set your API key using one of the methods above
   - Service will use fallback responses (still works!)

2. **"Connection refused"**
   - Make sure all 3 services are running
   - Check ports: 8000, 3001, 3002

3. **"OpenAI API error"**
   - Verify your API key is correct
   - Check your OpenAI account balance
   - Service will fallback to pre-written responses

4. **Frontend not connecting**
   - Check CORS settings
   - Verify all services are on correct ports

### **Service Status Check**
```bash
# Check all services
curl http://localhost:8000/health    # Mood Detection
curl http://localhost:3001/health    # Recipe Service  
curl http://localhost:3002/health    # Chatbot Service
```

## 🎨 **Customization Options**

### **Modify Chatbot Personality**
Edit the prompt in `src/index.js`:
```javascript
const prompt = `You are MoodBites, a friendly, empathetic food and wellness assistant...`;
```

### **Add More Mood Responses**
Edit `generateFallbackResponse()` function:
```javascript
const moodResponses = {
  joy: "Your custom joyful response...",
  // Add more moods
};
```

### **Adjust Recipe Count**
Change in `getRecipesByMood()`:
```javascript
preferences: { number: 6 } // Change from 4 to desired number
```

## 🚀 **Next Steps**

1. **✅ Set up OpenAI API key**
2. **✅ Start all services**
3. **✅ Test the integration**
4. **🔄 Customize chatbot personality**
5. **🎨 Integrate with your React frontend**
6. **🚀 Deploy to production**

## 🆘 **Support Resources**

- **OpenAI API**: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **Express.js**: [https://expressjs.com/](https://expressjs.com/)
- **Node.js**: [https://nodejs.org/](https://nodejs.org/)
- **CORS**: [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**🎉 Congratulations! You now have an AI-powered chatbot that understands emotions and recommends food!**

The chatbot will automatically:
- Detect user mood from text
- Fetch appropriate recipes
- Generate warm, empathetic responses
- Suggest specific foods for their emotional state

**Ready to make your users feel heard and nourished!** 🍽️✨
