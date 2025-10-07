# 🎤📁 Audio & File Messaging Features

This document describes the implementation of audio recording and file sharing features in the Moodbites chat system.

## 🚀 Features Implemented

### 🎤 Audio Messaging
- **Voice Recording**: Record audio messages with real-time visualization
- **Audio Playback**: Play received audio messages with progress control
- **Volume Monitoring**: Visual feedback during recording
- **Audio Controls**: Play, pause, mute, and seek functionality
- **Format Support**: WebM audio format for browser compatibility

### 📁 File Sharing
- **Multiple File Types**: Support for images, documents, videos, audio, and archives
- **Drag & Drop**: Intuitive file upload interface
- **File Preview**: Image previews and file type icons
- **Progress Tracking**: Upload progress indicators
- **File Validation**: Size limits and type checking
- **Download Support**: Easy file downloading

### 💬 Enhanced Chat Interface
- **Message Types**: Text, audio, and file messages
- **Rich UI**: Beautiful message bubbles with type-specific styling
- **Real-time Updates**: Instant message delivery and status
- **File Management**: Organized file sharing with metadata

## 🏗️ Architecture

### Frontend Components

#### 1. AudioRecorder.jsx
```javascript
// Features:
- Real-time audio recording with MediaRecorder API
- Volume visualization during recording
- Audio playback with progress control
- Mute/unmute functionality
- Recording time display
- Clean, modern UI with animations
```

#### 2. FileUploader.jsx
```javascript
// Features:
- Drag and drop file upload
- Multiple file selection
- File type validation
- Upload progress tracking
- File preview for images
- Error handling and user feedback
```

#### 3. MessageBubble.jsx
```javascript
// Features:
- Unified message display component
- Support for text, audio, and file messages
- Audio player with controls
- File download functionality
- Image preview modal
- Responsive design
```

### Backend Services

#### Chat Service Updates
```javascript
// New message schema fields:
{
  messageType: "text" | "audio" | "file",
  fileName: String,
  fileSize: Number,
  fileType: String,
  fileUrl: String,
  audioUrl: String,
  audioDuration: Number
}
```

#### File Upload Endpoints
```javascript
// Audio upload
POST /api/upload/audio
- Accepts: audio/webm files
- Returns: { audioUrl, duration, fileName, fileSize }

// File upload  
POST /api/upload/file
- Accepts: Any file type (16MB limit)
- Returns: { fileUrl, fileName, fileSize, fileType }
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
# Chat service
cd chat-service
npm install multer

# Frontend (if not already installed)
cd frontend
npm install
```

### 2. Start Services
```bash
# Start chat service
cd chat-service
npm start

# Start user service
cd user-service
npm start

# Start frontend
cd frontend
npm start
```

### 3. Test the Features
```bash
# Run test script
node test-audio-file-chat.js
```

## 📱 Usage Guide

### For Users (Chat.jsx)

#### Recording Audio Messages
1. Click the paperclip icon in the message input
2. Select "Voice Message"
3. Click the microphone to start recording
4. Click stop when finished
5. Preview your recording
6. Click "Send Audio" to send

#### Sharing Files
1. Click the paperclip icon in the message input
2. Select "Files"
3. Drag and drop files or click to browse
4. Review selected files
5. Click "Send Files" to share

### For Dieticians (ChatPanel.jsx)

#### Same functionality as users
- Audio recording and playback
- File upload and sharing
- Message management
- File downloads

## 🔧 Technical Details

### Audio Recording
```javascript
// MediaRecorder configuration
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
});

// Volume monitoring
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
microphone.connect(analyser);
```

### File Upload
```javascript
// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
```

### Message Handling
```javascript
// Socket.io message emission
socket.emit('send-message', {
  senderId: userId,
  receiverId: receiverId,
  message: messageText,
  messageType: 'audio' | 'file',
  // Additional fields based on type
});
```

## 🎨 UI/UX Features

### Audio Recorder Interface
- **Modern Design**: Clean, intuitive interface
- **Visual Feedback**: Recording indicators and volume visualization
- **Progress Control**: Audio playback with seek functionality
- **Error Handling**: Clear error messages and recovery options

### File Upload Interface
- **Drag & Drop**: Smooth drag and drop experience
- **File Preview**: Image thumbnails and file type icons
- **Progress Tracking**: Real-time upload progress
- **Validation**: File size and type checking with user feedback

### Message Display
- **Type-Specific Styling**: Different styles for text, audio, and file messages
- **Interactive Controls**: Play/pause audio, download files
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Considerations

### File Upload Security
- **File Type Validation**: Whitelist of allowed file types
- **Size Limits**: 16MB maximum file size
- **Virus Scanning**: Consider implementing virus scanning for uploaded files
- **Access Control**: Authentication required for file uploads

### Audio Security
- **Format Validation**: Only WebM audio format allowed
- **Duration Limits**: Consider implementing maximum recording duration
- **Storage Management**: Automatic cleanup of old audio files

## 🚀 Performance Optimizations

### Audio Optimization
- **Stream Compression**: WebM format for efficient audio storage
- **Lazy Loading**: Audio files loaded only when played
- **Caching**: Browser caching for frequently accessed audio

### File Optimization
- **Image Compression**: Automatic image compression for large files
- **CDN Integration**: Consider CDN for file delivery
- **Cleanup**: Automatic cleanup of unused files

## 🐛 Troubleshooting

### Common Issues

#### Audio Recording Not Working
```javascript
// Check microphone permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Microphone access granted'))
  .catch(err => console.error('Microphone access denied:', err));
```

#### File Upload Failing
```javascript
// Check file size and type
const maxSize = 16 * 1024 * 1024; // 16MB
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

if (file.size > maxSize) {
  console.error('File too large');
}
if (!allowedTypes.includes(file.type)) {
  console.error('File type not allowed');
}
```

#### Socket Connection Issues
```javascript
// Check socket connection
socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
socket.on('connect_error', (err) => console.error('Connection error:', err));
```

## 📊 Testing

### Manual Testing Checklist
- [ ] Audio recording works in different browsers
- [ ] File upload handles various file types
- [ ] Message delivery is real-time
- [ ] File downloads work correctly
- [ ] UI is responsive on mobile devices
- [ ] Error handling works properly

### Automated Testing
```bash
# Run the test script
node test-audio-file-chat.js

# Expected output:
# ✅ Health Check: Chat service is healthy
# ✅ User Authentication: User login successful
# ✅ Audio Upload: Audio uploaded successfully
# ✅ File Upload: File uploaded successfully
# ✅ Audio Message: Audio message structure is valid
# ✅ File Message: File message structure is valid
# ✅ File Download: File download successful
```

## 🔮 Future Enhancements

### Planned Features
- **Video Messages**: Video recording and sharing
- **Screen Sharing**: Screen capture and sharing
- **File Encryption**: End-to-end encryption for sensitive files
- **Cloud Storage**: Integration with cloud storage services
- **Advanced Audio**: Noise cancellation and audio enhancement

### Performance Improvements
- **WebRTC Integration**: Direct peer-to-peer file sharing
- **Progressive Loading**: Progressive file download
- **Offline Support**: Offline message queuing
- **Push Notifications**: Real-time notifications for new messages

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the test script output
3. Check browser console for errors
4. Verify all services are running
5. Test with different browsers and devices

## 🎉 Conclusion

The audio and file messaging features provide a comprehensive communication solution for the Moodbites platform. Users can now:

- Record and send voice messages
- Share files of various types
- Download shared files
- Enjoy a modern, intuitive interface
- Experience real-time communication

These features enhance the user experience and provide more ways for patients and dieticians to communicate effectively.
