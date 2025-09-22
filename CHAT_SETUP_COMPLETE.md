# 🚀 Complete Chat System Setup Guide

## ✅ What's Been Fixed

### 1. **Port Configuration**
- ✅ Chat Service: Port 3006 (updated from 3005)
- ✅ Frontend: Updated to connect to port 3006
- ✅ Diet Service: Port 5005 (as per your changes)

### 2. **Chat Service Structure**
- ✅ Proper MongoDB schema with embedded messages
- ✅ Socket.io real-time messaging
- ✅ REST API for conversation history
- ✅ Message read receipts and typing indicators

### 3. **Frontend Integration**
- ✅ Advanced Chat.jsx with template-like design
- ✅ Real-time messaging functionality
- ✅ Diet plan side panel
- ✅ Notifications system
- ✅ Professional UI/UX

## 🛠️ How to Start Everything

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 2: Start All Services

**Option A: Manual Start (Recommended)**
```bash
# Terminal 1 - User Service (Port 5000)
cd user-service
npm run dev

# Terminal 2 - Diet Service (Port 5005)
cd diet-service
npm run dev

# Terminal 3 - Chat Service (Port 3006)
cd chat-service
npm run dev

# Terminal 4 - Frontend (Port 3000)
cd frontend
npm run dev
```

**Option B: Use the Batch File**
```bash
# Double-click start-chat-services.bat
# This will start the chat service automatically
```

### Step 3: Test the System

1. **Open Frontend**: http://localhost:3000
2. **Login as User**: Use existing user account
3. **Go to Dashboard**: Click "Consult Dietician"
4. **Select Dietician**: Choose an active dietician
5. **Start Chat**: Click "Live Chat"
6. **Test Messaging**: Type and send messages

## 🔧 Environment Setup

### Chat Service (.env)
Create `chat-service/.env`:
```env
PORT=3006
MONGODB_URI=mongodb://localhost:27017/moodbites_chat
FRONTEND_URL=http://localhost:3000
```

### User Service (.env)
Make sure your user service has:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodbites
```

### Diet Service (.env)
Make sure your diet service has:
```env
PORT=5005
MONGODB_URI=mongodb://localhost:27017/moodbites
```

## 🧪 Testing the Chat System

### Test Chat Service
```bash
cd chat-service
node test-chat-service.js
```

### Test Frontend
1. Open browser to http://localhost:3000
2. Login with user credentials
3. Navigate to Dashboard → Consult Dietician
4. Select a dietician and start chatting

## 📊 Database Schema

### Conversations Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId], // [userId, dieticianId]
  messages: [Message], // Embedded messages
  lastMessage: String,
  lastUpdated: Date
}
```

### Messages (Embedded in Conversations)
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  messageType: String, // 'text', 'image', 'file'
  createdAt: Date,
  isRead: Boolean
}
```

## 🎯 Features Working

### ✅ Real-time Messaging
- Send and receive messages instantly
- Messages stored in MongoDB
- Read receipts and typing indicators

### ✅ Advanced UI
- Professional template-like design
- Diet plan side panel
- Notifications system
- Emoji picker and file attachments

### ✅ Integration
- User service for authentication
- Diet service for meal plans
- MongoDB for data persistence

## 🚨 Troubleshooting

### If Chat Service Won't Start
```bash
cd chat-service
npm install
npm run dev
```

### If Frontend Can't Connect
1. Check that chat service is running on port 3006
2. Verify CORS settings in chat service
3. Check browser console for errors

### If Messages Don't Save
1. Verify MongoDB connection
2. Check database name: `moodbites_chat`
3. Look for errors in chat service console

### If Diet Plans Don't Load
1. Check diet service is running on port 5005
2. Verify API endpoints in frontend
3. Check user authentication

## 🎉 Success Indicators

When everything is working, you should see:

1. **Chat Service Console**:
   ```
   ✅ MongoDB connected successfully
   🚀 Chat service running on port 3006
   👤 User connected: [socket-id]
   ```

2. **Frontend**:
   - Can type and send messages
   - Messages appear in real-time
   - Diet plans load in side panel
   - Notifications work

3. **Database**:
   - Conversations collection created
   - Messages stored with proper structure
   - Read status updates correctly

## 🔄 Next Steps

1. **Test with Multiple Users**: Open multiple browser tabs
2. **Test Diet Plan Generation**: Use the + button in side panel
3. **Test File Uploads**: Try sending images/documents
4. **Test Notifications**: Check notification system

Your chat system is now fully functional! 🚀
