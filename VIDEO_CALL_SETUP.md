# 🎥 Video Call Setup Guide

## ✅ **Fixed Issues:**

1. **Environment Configuration Fixed:**
   - Removed `process.env` references that don't work with Vite
   - Updated to use direct configuration values
   - Created centralized environment config

2. **Dependencies Installed:**
   - ✅ `@livekit/components-react` - React components
   - ✅ `@livekit/components-styles` - Required CSS styles
   - ✅ `livekit-client` - Client SDK
   - ✅ `livekit-server-sdk` - Server SDK

## 🚀 **How to Start:**

### **1. Start the Video Call Backend Service:**
```bash
# Run the batch file:
start-video-call-service.bat

# Or manually:
cd video-call-service
npm install
npm start
```

### **2. Start the Frontend:**
```bash
cd frontend
npm start
```

### **3. Test the Video Call:**
- Go to: `http://localhost:3000/test-video-call`
- Configure room name and user details
- Click "Start Test Call"
- Test camera, microphone, and video functionality

## 🔧 **Configuration:**

The video call system uses these hardcoded values (in `frontend/src/config/environment.js`):

- **LiveKit URL:** `wss://moodbites-ansgxjx5.livekit.cloud`
- **Video Call Service:** `http://localhost:5006`
- **API Endpoint:** `http://localhost:5006/api/getToken`

## 🎯 **Routes Available:**

- `/test-video-call` - Test page for development
- `/video-consultation/:roomId/:userRole?` - Main consultation route

## 🔐 **Security:**

- Tokens are generated server-side for security
- Role-based permissions (user vs dietician)
- JWT tokens with 1-hour expiration
- Secure WebRTC connections

## 🐛 **Troubleshooting:**

If you see `process is not defined` errors:
- ✅ **Fixed:** Updated environment.js to use direct values instead of process.env
- ✅ **Fixed:** Installed @livekit/components-styles dependency

## 📱 **Features:**

- ✅ Real-time video/audio calls
- ✅ Multiple participants support
- ✅ Role-based permissions
- ✅ Secure token generation
- ✅ Responsive UI with animations
- ✅ Error handling and loading states

The video call system is now fully functional! 🎉
