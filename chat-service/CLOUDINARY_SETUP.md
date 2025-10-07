# 🌩️ Cloudinary Integration Setup

This guide explains how to set up Cloudinary for storing audio and image files in the Moodbites chat service.

## 🔧 Configuration

### 1. Environment Variables

Add these variables to your `.env` file in the `chat-service` directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your credentials from the "Product Environment Credentials" section

## 📁 File Organization

Files are organized in Cloudinary with the following folder structure:

```
moodbites/
├── audio/          # Voice messages
├── images/          # Image files
├── videos/          # Video files
└── files/           # Other documents
```

## 🚀 Features

### Audio Upload
- **Endpoint**: `POST /api/upload/audio`
- **Folder**: `moodbites/audio`
- **Resource Type**: `video` (Cloudinary treats audio as video)
- **Response**: Returns secure URL and public ID

### File Upload
- **Endpoint**: `POST /api/upload/file`
- **Folders**: Organized by file type
- **Resource Type**: Auto-detected based on file type
- **Response**: Returns secure URL and public ID

### File Deletion
- **Endpoint**: `DELETE /api/upload/delete/:publicId`
- **Purpose**: Remove files from Cloudinary
- **Response**: Success/failure status

## 🔒 Security Features

### File Validation
- File size limits (16MB)
- File type validation
- Secure upload with unique filenames

### Access Control
- JWT authentication required
- Secure URLs for file access
- Automatic cleanup of temporary files

## 📊 Benefits

### Performance
- **CDN Delivery**: Fast global content delivery
- **Image Optimization**: Automatic image optimization
- **Video Processing**: Automatic video transcoding

### Storage
- **Unlimited Storage**: No storage limits
- **Backup**: Automatic backup and redundancy
- **Versioning**: File version management

### Analytics
- **Usage Tracking**: Monitor file usage
- **Bandwidth Monitoring**: Track data transfer
- **Storage Analytics**: Storage usage insights

## 🛠️ Implementation Details

### Upload Process
1. File received via multer
2. Temporary local storage
3. Upload to Cloudinary
4. Clean up local file
5. Return secure URL

### Error Handling
- Upload failure recovery
- Local file cleanup
- Detailed error messages
- Retry mechanisms

## 🧪 Testing

### Test Audio Upload
```bash
curl -X POST http://localhost:3006/api/upload/audio \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "audio=@test-audio.webm"
```

### Test File Upload
```bash
curl -X POST http://localhost:3006/api/upload/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-image.jpg" \
  -F "fileType=image"
```

### Test File Deletion
```bash
curl -X DELETE http://localhost:3006/api/upload/delete/PUBLIC_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Monitoring

### Cloudinary Dashboard
- Monitor uploads and usage
- View file analytics
- Manage storage and bandwidth

### Application Logs
- Upload success/failure logs
- Error tracking and debugging
- Performance monitoring

## 🚨 Troubleshooting

### Common Issues

#### Upload Failures
```javascript
// Check Cloudinary configuration
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
```

#### File Not Found
```javascript
// Verify public ID
const result = await cloudinary.api.resource(publicId);
console.log('File exists:', result);
```

#### Authentication Errors
```javascript
// Check API credentials
const test = await cloudinary.api.ping();
console.log('Connection test:', test);
```

## 📈 Performance Optimization

### Image Optimization
- Automatic format conversion
- Quality optimization
- Responsive image delivery

### Video Optimization
- Automatic transcoding
- Adaptive bitrate streaming
- Thumbnail generation

### Audio Optimization
- Format conversion
- Compression optimization
- Streaming delivery

## 🔮 Future Enhancements

### Planned Features
- **Image Transformations**: Resize, crop, filters
- **Video Processing**: Thumbnails, previews
- **Audio Processing**: Waveform generation
- **Batch Operations**: Multiple file uploads

### Advanced Features
- **AI Integration**: Content analysis
- **Moderation**: Content filtering
- **Analytics**: Usage insights
- **Backup**: Automated backups

## 📞 Support

For issues or questions:
1. Check Cloudinary documentation
2. Verify environment variables
3. Test with small files first
4. Check network connectivity
5. Review error logs

## 🎉 Benefits Summary

✅ **Scalable Storage**: Unlimited cloud storage
✅ **Global CDN**: Fast worldwide delivery
✅ **Automatic Optimization**: Images and videos optimized
✅ **Secure Access**: Secure URLs and authentication
✅ **Analytics**: Usage tracking and insights
✅ **Cost Effective**: Pay only for what you use
✅ **Reliable**: 99.9% uptime guarantee
✅ **Easy Integration**: Simple API integration

Your chat service now has enterprise-grade file storage with Cloudinary! 🚀
