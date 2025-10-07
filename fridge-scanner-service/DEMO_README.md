# 🍎 Fridge Scanner Demo

A complete demo application for testing the Fridge Scanner food recognition service.

## 🚀 Quick Start

### Option 1: One-Click Demo (Windows)
```bash
start_demo.bat
```

### Option 2: Manual Start
1. **Start Backend:**
   ```bash
   python backend.py
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   python serve_frontend.py
   ```

3. **Open Browser:**
   - Go to `http://localhost:8080`

## 🎯 Features

### Frontend Interface
- **📸 Drag & Drop Upload**: Easy image upload with drag and drop support
- **🖼️ Image Preview**: See your uploaded image before scanning
- **🎯 Real-time Results**: Live food detection with confidence scores
- **📊 Visual Statistics**: Detection count, confidence levels, and averages
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

### Backend API
- **🍎 Food Recognition**: Uses Roboflow API for accurate food detection
- **📸 Image Processing**: Supports multiple image formats
- **📊 Confidence Scoring**: Returns confidence percentages
- **📦 Bounding Boxes**: Provides coordinates for detected items
- **🛡️ Error Handling**: Comprehensive error handling and validation

## 🧪 Testing

### Test with Sample Image
```bash
python create_test_image.py
```
This creates a test image with simple shapes representing food items.

### API Testing
```bash
python test_api.py
```
Tests the backend API endpoints.

## 📁 File Structure

```
fridge-scanner-service/
├── backend.py              # Flask API server
├── frontend/
│   └── index.html          # Demo web interface
├── serve_frontend.py       # Frontend server
├── start_demo.bat          # One-click demo launcher
├── create_test_image.py    # Test image generator
├── test_api.py            # API testing script
└── requirements.txt        # Python dependencies
```

## 🔧 API Endpoints

### Health Check
```
GET http://localhost:4005/api/health
```

### Food Recognition
```
POST http://localhost:4005/api/predict
Content-Type: multipart/form-data
Body: file (image file)
```

## 📊 Response Format

```json
{
  "success": true,
  "predictions": [
    {
      "class": "apple",
      "confidence": 85.5,
      "bbox": {
        "x": 100,
        "y": 150,
        "width": 80,
        "height": 90
      }
    }
  ],
  "top_prediction": { ... },
  "total_detections": 1
}
```

## 🎨 Frontend Features

### Upload Interface
- Drag and drop support
- File type validation
- Size limit checking (16MB max)
- Visual feedback for uploads

### Results Display
- **Top Prediction**: Highlighted with special styling
- **Confidence Scores**: Color-coded confidence levels
- **Bounding Box Info**: Position and size data
- **Statistics**: Total detections, average confidence

### Responsive Design
- Mobile-friendly interface
- Touch-friendly controls
- Adaptive layout for different screen sizes

## 🛠️ Development

### Backend Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run in debug mode
export FLASK_ENV=development
python backend.py
```

### Frontend Development
```bash
# Serve frontend
python serve_frontend.py

# Access at http://localhost:8080
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if port 4005 is available
   - Verify Python dependencies are installed
   - Check Roboflow API key configuration

2. **Frontend not loading**
   - Ensure backend is running on port 4005
   - Check if port 8080 is available
   - Verify browser console for errors

3. **API connection errors**
   - Check CORS settings
   - Verify API endpoints are accessible
   - Check network connectivity

### Debug Mode

Enable debug logging:
```python
# In backend.py
app.run(debug=True, host='0.0.0.0', port=4005)
```

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Security Notes

- This is a demo application
- API keys are hardcoded for testing
- No authentication required
- File uploads are temporary

## 🚀 Production Deployment

For production use:
1. Use environment variables for API keys
2. Implement proper authentication
3. Add rate limiting
4. Use a production WSGI server
5. Set up proper logging
6. Add monitoring and health checks

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all services are running
3. Test API endpoints manually
4. Check network connectivity

## 🎉 Enjoy Testing!

Upload some food images and see the AI in action! 🍎🥕🍌
