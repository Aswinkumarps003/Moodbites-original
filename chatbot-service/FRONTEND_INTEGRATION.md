# 🎨 Frontend Integration Guide

## 🚀 **How to Add Chatbot to Your React App**

### **1. Add Chatbot Component to EmotionDetectionPage**

Add this to your `EmotionDetectionPage.jsx`:

```jsx
// Add this state
const [chatbotMessages, setChatbotMessages] = useState([]);
const [isChatbotTyping, setIsChatbotTyping] = useState(false);

// Add this function
const sendMessageToChatbot = async (message) => {
  setIsChatbotTyping(true);
  
  try {
    const response = await fetch('http://localhost:3002/api/complete-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage: message }),
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Add user message
      setChatbotMessages(prev => [...prev, {
        type: 'user',
        content: message,
        timestamp: new Date()
      }]);
      
      // Add chatbot response
      setChatbotMessages(prev => [...prev, {
        type: 'bot',
        content: result.chatbotReply,
        mood: result.detectedMood,
        recipes: result.recipes,
        timestamp: new Date()
      }]);
      
      // Update recommendations with new recipes
      setRecommendations(result.recipes);
      
    } else {
      throw new Error('Failed to get chatbot response');
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    // Add error message
    setChatbotMessages(prev => [...prev, {
      type: 'bot',
      content: "I'm having trouble connecting right now, but I can still help you with food recommendations!",
      timestamp: new Date()
    }]);
  } finally {
    setIsChatbotTyping(false);
  }
};

// Add this to your JSX
<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
    <MessageCircle className="w-6 h-6 text-purple-600" />
    Chat with MoodBites AI
  </h3>
  
  {/* Chat Messages */}
  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
    {chatbotMessages.map((msg, index) => (
      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          msg.type === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm">{msg.content}</p>
          {msg.recipes && msg.recipes.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <p>🍽️ Suggested: {msg.recipes.map(r => r.name).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    ))}
    
    {isChatbotTyping && (
      <div className="flex justify-start">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )}
  </div>
  
  {/* Quick Message Buttons */}
  <div className="grid grid-cols-2 gap-2 mb-4">
    {[
      "I'm feeling sad today",
      "I'm anxious about work",
      "I'm really happy!",
      "I need comfort food"
    ].map((quickMsg, index) => (
      <button
        key={index}
        onClick={() => sendMessageToChatbot(quickMsg)}
        disabled={isChatbotTyping}
        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
      >
        {quickMsg}
      </button>
    ))}
  </div>
  
  {/* Custom Message Input */}
  <form onSubmit={(e) => {
    e.preventDefault();
    const input = e.target.message;
    if (input.value.trim()) {
      sendMessageToChatbot(input.value.trim());
      input.value = '';
    }
  }} className="flex gap-2">
    <input
      name="message"
      type="text"
      placeholder="Tell me how you're feeling..."
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      disabled={isChatbotTyping}
    />
    <button
      type="submit"
      disabled={isChatbotTyping}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
    >
      Send
    </button>
  </form>
</div>
```

### **2. Add MessageCircle Icon Import**

```jsx
import { 
  // ... existing imports
  MessageCircle 
} from "lucide-react";
```

### **3. Test the Integration**

1. **Start all services** using the batch file
2. **Open your React app**
3. **Type a message** like "I'm feeling anxious today"
4. **Watch the magic happen!** 🎉

## 🎯 **What Users Will Experience**

### **Complete Flow Example:**

1. **User types**: "I'm stressed about my exam tomorrow"
2. **AI detects**: `fear` (anxiety)
3. **Service fetches**: Soothing soup recipes
4. **Chatbot responds**: Warm, empathetic message with food suggestions
5. **Frontend shows**: Chat message + recipe recommendations

### **Sample Chatbot Response:**
> "I hear you, and exam stress is totally normal! 🌸 When your mind is racing, gentle, soothing foods can help calm your nervous system. I'd recommend trying a **warm soothing soup** - it's like a comforting hug for your stomach. A **calming herbal tea** might also help settle those butterflies. What sounds most appealing to you right now?"

## 🔧 **Customization Options**

### **Change Chatbot Personality**
Edit the prompt in `chat-service/src/index.js`:
```javascript
const prompt = `You are MoodBites, a [your custom personality] food and wellness assistant...`;
```

### **Add More Quick Messages**
Modify the quick message buttons:
```jsx
{[
  "I'm feeling sad today",
  "I'm anxious about work", 
  "I'm really happy!",
  "I need comfort food",
  "I'm feeling angry",
  "I want something exciting"
].map((quickMsg, index) => (
  // ... button code
))}
```

### **Style the Chat Interface**
Customize colors, spacing, and animations in the CSS classes.

## 🚨 **Troubleshooting Frontend Issues**

### **Common Problems:**

1. **"Failed to fetch"**
   - Make sure chatbot service is running on port 3002
   - Check CORS settings

2. **Messages not appearing**
   - Check browser console for errors
   - Verify the state updates are working

3. **Chatbot not responding**
   - Check if OpenAI API key is set
   - Verify all services are running

### **Debug Steps:**
```javascript
// Add this to see what's happening
console.log('Chatbot response:', result);
console.log('Current messages:', chatbotMessages);
```

## 🎨 **UI Enhancement Ideas**

### **Add Typing Indicators**
```jsx
{isChatbotTyping && (
  <div className="flex items-center gap-2 text-gray-500">
    <div className="animate-pulse">🤖</div>
    <span>MoodBites is thinking...</span>
  </div>
)}
```

### **Add Recipe Cards in Chat**
```jsx
{msg.recipes && msg.recipes.length > 0 && (
  <div className="mt-3 space-y-2">
    {msg.recipes.slice(0, 2).map((recipe, idx) => (
      <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm">
        <h4 className="font-medium text-sm">{recipe.name}</h4>
        <p className="text-xs text-gray-600">{recipe.moodBenefit}</p>
      </div>
    ))}
  </div>
)}
```

### **Add Mood Emojis**
```jsx
{msg.mood && (
  <span className="ml-2 text-lg">
    {moods.find(m => m.id === msg.mood)?.emoji || '😊'}
  </span>
)}
```

## 🚀 **Next Steps**

1. **✅ Add the chatbot component** to your page
2. **✅ Test with different messages**
3. **🎨 Customize the UI** to match your design
4. **🔄 Add more features** like recipe saving
5. **🚀 Deploy and share** with users!

---

**🎉 Your users will now have an AI companion that understands their emotions and suggests perfect food!**

The chatbot will make your app feel **personal, caring, and intelligent** - exactly what users want when they're seeking comfort through food! 🍽️✨
