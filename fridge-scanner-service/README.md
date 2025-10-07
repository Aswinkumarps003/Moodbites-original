# Fridge Scanner Service

A Python Flask backend service for food recognition using Roboflow API.

## Features

- 🍎 Food item detection and classification
- 📸 Image upload and processing
- 🔍 Confidence scoring
- 📊 Bounding box coordinates
- 🌐 RESTful API endpoints

## Prerequisites

- Python 3.8 or higher
- Roboflow API key
- Internet connection for API calls

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file with your Roboflow credentials:

```env
ROBOFLOW_API_KEY=your_api_key_here
ROBOFLOW_MODEL_ID=your_model_id_here
ROBOFLOW_VERSION=1
PORT=4005
DEBUG=True
```

### 3. Start the Service

**Option A: Using Python directly**
```bash
python backend.py
```

**Option B: Using the startup script**
```bash
python start.py
```

**Option C: Using the batch file (Windows)**
```bash
start.bat
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Predict Food Items
```
POST /api/predict
Content-Type: multipart/form-data

Body: file (image file)
```

### Alternative Fridge Scan
```
POST /api/scan-fridge
Content-Type: multipart/form-data

Body: file (image file)
```

## Response Format

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
  "top_prediction": {
    "class": "apple",
    "confidence": 85.5,
    "bbox": {
      "x": 100,
      "y": 150,
      "width": 80,
      "height": 90
    }
  },
  "total_detections": 1
}
```

## Supported Image Formats

- PNG
- JPG/JPEG
- GIF
- BMP
- WebP

## File Size Limit

Maximum file size: 16MB

## Error Handling

The service includes comprehensive error handling for:
- Invalid file types
- File size limits
- API failures
- Network issues
- Server errors

## Development

To run in development mode:

```bash
export FLASK_ENV=development
python backend.py
```

## Production Deployment

For production deployment, consider using:
- Gunicorn (WSGI server)
- Nginx (reverse proxy)
- Docker (containerization)

## Troubleshooting

### Common Issues

1. **Python version compatibility**
   - Ensure Python 3.8+ is installed
   - Check with `python --version`

2. **Missing dependencies**
   - Run `pip install -r requirements.txt`
   - Check for permission issues

3. **API key issues**
   - Verify Roboflow API key is correct
   - Check model ID and version

4. **Port conflicts**
   - Change PORT in .env file
   - Check if port 4005 is available

### Logs

The service logs important information to the console:
- Service startup
- API requests
- Errors and exceptions
- File processing status
