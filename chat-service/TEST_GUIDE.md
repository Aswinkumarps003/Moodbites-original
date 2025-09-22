# Chat Service Testing Guide

## 🧪 Testing Your MongoDB Messages

This guide helps you test the chat service with your MongoDB Atlas data.

## Prerequisites

1. **Chat Service Running**: Make sure the chat service is running on port 3006
2. **MongoDB Atlas**: Your database should be accessible
3. **Environment Variables**: Ensure your `.env` file has the correct `MONGODB_URI`

## Test Scripts

### 1. Simple API Test (Recommended)
```bash
cd chat-service
node test-api-endpoints.js
```

This test:
- ✅ Checks chat service health
- ✅ Fetches conversations for dietician
- ✅ Displays your MongoDB messages
- ✅ Tests conversation stats
- ❌ No MongoDB connection required

### 2. Full MongoDB Test
```bash
cd chat-service
node test-mongodb-messages.js
```

This test:
- ✅ Connects to MongoDB Atlas
- ✅ Tests all API endpoints
- ✅ Verifies message formatting
- ❌ Requires MongoDB connection

## Expected Results

### Your MongoDB Data Structure
```javascript
{
  "_id": "68cfa39158149e6f6c351e14",
  "participants": [
    "68bd5ae01da5747f7cfe432d", // User ID
    "68cd9c232f24476e904c5956"  // Dietician ID
  ],
  "messages": [
    {
      "senderId": "68bd5ae01da5747f7cfe432d",    // User sent
      "receiverId": "68cd9c232f24476e904c5956",  // To dietician
      "message": "hi",
      "messageType": "text",
      "createdAt": "2025-01-22T...",
      "isRead": false
    }
  ]
}
```

### Expected Test Output
```
🧪 Testing Chat Service API Endpoints...

1. Testing chat service health...
✅ Chat service health: { status: 'OK', service: 'chat-service' }

2. Testing conversations endpoint...
✅ Conversations fetched: 1
📋 First conversation: {
  id: '68cfa39158149e6f6c351e14',
  participants: ['68bd5ae01da5747f7cfe432d', '68cd9c232f24476e904c5956'],
  messageCount: 1,
  lastMessage: 'hi',
  lastUpdated: '2025-01-22T...'
}

📝 Messages in conversation:
  1. [68bd5ae01da5747f7cfe432d] → [68cd9c232f24476e904c5956]: "hi" (2025-01-22T...)

3. Testing specific conversation messages...
✅ Messages fetched: 1
  Message 1: {
    id: '68cfa39158149e6f6c351e15',
    senderId: '68bd5ae01da5747f7cfe432d',
    receiverId: '68cd9c232f24476e904c5956',
    message: 'hi',
    messageType: 'text',
    isRead: false,
    createdAt: '2025-01-22T...'
  }

4. Testing conversation stats...
✅ Conversation stats: { totalMessages: 1, unreadMessages: 1 }

🎉 API endpoints test completed!
✅ Chat service is working with your MongoDB data
✅ Your "hi" message should be visible in the dietician chat panel
```

## Troubleshooting

### Error: `ECONNREFUSED ::1:27017`
- **Cause**: Script trying to connect to local MongoDB instead of Atlas
- **Fix**: Use `test-api-endpoints.js` instead of `test-mongodb-messages.js`

### Error: `MONGODB_URI is not defined`
- **Cause**: Environment variables not loaded
- **Fix**: Make sure `.env` file exists with correct `MONGODB_URI`

### Error: `Chat service not responding`
- **Cause**: Chat service not running
- **Fix**: Start chat service with `node server.js`

## Next Steps

1. **Run the test**: `node test-api-endpoints.js`
2. **Check results**: Verify your "hi" message appears
3. **Test frontend**: Open dietician chat panel
4. **Verify display**: Message should show on left side as patient message

## Success Criteria

- ✅ Chat service responds to health check
- ✅ Conversations endpoint returns data
- ✅ Your "hi" message is visible
- ✅ Message formatting is correct
- ✅ Dietician chat panel displays messages

Your MongoDB messages should now be properly displayed in the dietician chat panel! 🎉
