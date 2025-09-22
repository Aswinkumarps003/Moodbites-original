# Chat Service

Live chat service for MoodBites with MongoDB and Socket.io integration.

## Features

- **Real-time messaging** with Socket.io
- **MongoDB persistence** for message history
- **Conversation management** between users and dieticians
- **Message types** support (text, image, file)
- **Read receipts** and typing indicators
- **RESTful API** for conversation history

## MongoDB Schema

### Conversation Model
- `participants`: Array of user IDs (dietician + user)
- `messages`: Embedded array of message objects
- `lastMessage`: String of the most recent message
- `lastUpdated`: Timestamp of last activity

### Message Model
- `senderId`: ObjectId reference to User
- `receiverId`: ObjectId reference to User
- `message`: String content
- `messageType`: Enum ["text", "image", "file"]
- `createdAt`: Timestamp
- `isRead`: Boolean read status

## Environment Variables

Create a `.env` file with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/moodbites_chat

# Server Configuration
PORT=3006

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT Secret (if needed for authentication)
JWT_SECRET=your_jwt_secret_here

# Redis Configuration (for future scaling)
REDIS_URL=redis://localhost:6379
```

## Installation

```bash
npm install
```

## Running the Service

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/conversations/:userId` - Get user's conversations
- `GET /api/conversations/:conversationId/messages` - Get conversation messages

### Socket.io Events

#### Client → Server
- `join-room` - Join user's personal room
- `send-message` - Send a new message
- `mark-as-read` - Mark message as read
- `typing` - Send typing indicator

#### Server → Client
- `receive-message` - Receive new message
- `message-sent` - Confirm message sent
- `message-read` - Notify message was read
- `user-typing` - Receive typing indicator
- `message-error` - Error sending message

## Usage Example

```javascript
// Frontend connection
const socket = io('http://localhost:3006');

// Join user room
socket.emit('join-room', userId);

// Send message
socket.emit('send-message', {
  senderId: 'user123',
  receiverId: 'dietician456',
  message: 'Hello!',
  messageType: 'text'
});

// Listen for messages
socket.on('receive-message', (data) => {
  console.log('New message:', data);
});
```

## Database Indexes

The schema includes optimized indexes for:
- Conversation queries by participants
- Message queries by sender/receiver
- Time-based sorting (lastUpdated, createdAt)

## Future Enhancements

- Redis integration for scaling
- Message encryption
- File upload handling
- Push notifications
- Message search functionality
