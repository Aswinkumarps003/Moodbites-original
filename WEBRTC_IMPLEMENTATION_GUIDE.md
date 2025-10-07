# WebRTC Implementation Guide for MoodBites Chat

## 🎯 **Overview**

This implementation adds **WebRTC (Web Real-Time Communication)** capabilities to your existing Socket.IO chat system, creating a **hybrid architecture** that provides:

- **Socket.IO** for reliable text messaging with persistence
- **WebRTC** for peer-to-peer video/audio calls
- **LiveKit** integration for professional video consultations

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │  Dietician      │    │  WebRTC         │
│                 │    │  Browser        │    │  Signaling      │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  Server         │
│  │ Socket.IO │  │◄──►│  │ Socket.IO │  │    │  (Port 3007)    │
│  │ Chat      │  │    │  │ Chat      │  │    │                 │
│  └───────────┘  │    │  └───────────┘  │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │                 │
│  │ WebRTC    │  │◄──►│  │ WebRTC    │  │◄──►│                 │
│  │ Video/Audio│ │    │  │ Video/Audio│ │    │                 │
│  └───────────┘  │    │  └───────────┘  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Chat Service  │
                    │   (Port 3005/6) │
                    │                 │
                    │  ┌───────────┐  │
                    │  │ MongoDB   │  │
                    │  │ Messages  │  │
                    │  └───────────┘  │
                    └─────────────────┘
```

## 📁 **New Files Created**

### **Frontend Components:**
- `frontend/src/hooks/useWebRTC.js` - WebRTC hook for managing peer connections
- `frontend/src/components/WebRTCCall.jsx` - Video/audio call interface
- Updated `frontend/src/pages/Chat.jsx` - Integrated WebRTC calls
- Updated `frontend/src/dietician/components/UserChatPanel.jsx` - Added WebRTC support

### **Backend Services:**
- `webrtc-signaling-service/server.js` - WebRTC signaling server
- `webrtc-signaling-service/package.json` - Dependencies
- `webrtc-signaling-service/start.bat` - Startup script
- `webrtc-signaling-service/env.example` - Environment variables

## 🚀 **Setup Instructions**

### **1. Install WebRTC Signaling Service**

```bash
cd webrtc-signaling-service
npm install
```

### **2. Configure Environment Variables**

Create `.env` file in `webrtc-signaling-service/`:

```env
PORT=3007
JWT_SECRET=your-jwt-secret-key-here
MONGODB_URI=mongodb://localhost:27017/moodbites
CORS_ORIGIN=http://localhost:3000
```

### **3. Start the WebRTC Signaling Service**

```bash
# Option 1: Using the batch file
start.bat

# Option 2: Using npm
npm start

# Option 3: Using node directly
node server.js
```

### **4. Start Your Existing Services**

```bash
# Chat Service (Port 3005/3006)
cd chat-service
npm start

# User Service (Port 5000)
cd user-service
npm start

# Frontend (Port 3000)
cd frontend
npm start
```

## 🎮 **How to Use**

### **For Users:**
1. Navigate to chat with a dietician
2. Click the **Video** or **Phone** button in the chat header
3. WebRTC call interface will open
4. Grant camera/microphone permissions
5. Call will be established peer-to-peer

### **For Dieticians:**
1. Open the UserChatPanel
2. Select a patient
3. Click **Video** or **Phone** button
4. WebRTC call interface will open
5. Call will be established peer-to-peer

## 🔧 **WebRTC Features**

### **Video Calls:**
- ✅ HD video streaming
- ✅ Camera on/off toggle
- ✅ Picture-in-picture local video
- ✅ Full-screen mode
- ✅ Call duration timer

### **Audio Calls:**
- ✅ High-quality audio
- ✅ Microphone mute/unmute
- ✅ Audio-only mode
- ✅ Call duration timer

### **Data Channels:**
- ✅ P2P text messaging (optional)
- ✅ File sharing capability
- ✅ Real-time data exchange

### **Connection Management:**
- ✅ Automatic ICE candidate exchange
- ✅ STUN server support
- ✅ Connection state monitoring
- ✅ Graceful call termination

## 🌐 **WebRTC Configuration**

### **STUN Servers:**
```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};
```

### **Media Constraints:**
```javascript
const mediaConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};
```

## 🔄 **Call Flow**

### **Outgoing Call:**
1. User clicks video/audio button
2. `WebRTCCall` component opens
3. Local media stream initialized
4. Peer connection created
5. Offer generated and sent via signaling server
6. Target user receives call request
7. If accepted, answer sent back
8. ICE candidates exchanged
9. P2P connection established

### **Incoming Call:**
1. Signaling server receives offer
2. Call request notification sent to target
3. Target user sees incoming call UI
4. User can accept/reject
5. If accepted, answer sent back
6. ICE candidates exchanged
7. P2P connection established

## 🛡️ **Security Features**

- ✅ JWT authentication for signaling
- ✅ User verification before calls
- ✅ Secure peer-to-peer connections
- ✅ No media data through server
- ✅ Encrypted data channels

## 📊 **Monitoring & Debugging**

### **Connection States:**
- `connecting` - Establishing connection
- `connected` - Active call
- `disconnected` - Call ended
- `failed` - Connection failed

### **Debug Logs:**
```javascript
// Enable WebRTC debugging
localStorage.setItem('webrtc-debug', 'true');
```

### **Health Check:**
```bash
curl http://localhost:3007/health
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Camera/Microphone Access Denied:**
   - Ensure HTTPS or localhost
   - Check browser permissions
   - Verify media devices

2. **Connection Failed:**
   - Check STUN server availability
   - Verify firewall settings
   - Test with different browsers

3. **Signaling Server Issues:**
   - Check JWT token validity
   - Verify server is running on port 3007
   - Check CORS configuration

### **Browser Compatibility:**
- ✅ Chrome 56+
- ✅ Firefox 52+
- ✅ Safari 11+
- ✅ Edge 79+

## 🚀 **Advanced Features**

### **Screen Sharing:**
```javascript
// Add to useWebRTC hook
const startScreenShare = async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });
  // Replace video track in peer connection
};
```

### **Recording:**
```javascript
// Add to useWebRTC hook
const startRecording = () => {
  const mediaRecorder = new MediaRecorder(stream);
  // Record and save call
};
```

### **Group Calls:**
- Extend signaling server for multiple participants
- Use SFU (Selective Forwarding Unit) architecture
- Implement LiveKit for professional group calls

## 📈 **Performance Optimization**

- **Adaptive Bitrate:** Adjust quality based on connection
- **Bandwidth Management:** Monitor and optimize data usage
- **Connection Pooling:** Reuse peer connections
- **Caching:** Cache ICE candidates and offers

## 🔮 **Future Enhancements**

1. **AI-Powered Features:**
   - Real-time transcription
   - Sentiment analysis
   - Health monitoring

2. **Advanced Media:**
   - 4K video support
   - Spatial audio
   - Virtual backgrounds

3. **Integration:**
   - Calendar scheduling
   - Payment processing
   - Health record access

## 📞 **Support**

For issues or questions:
1. Check browser console for errors
2. Verify all services are running
3. Test with different browsers
4. Check network connectivity

---

**🎉 Congratulations!** You now have a complete WebRTC implementation for your MoodBites chat system with both Socket.IO text messaging and peer-to-peer video/audio calls!
