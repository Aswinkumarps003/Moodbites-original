# 🩸 Blood Report Analysis Service

## Overview
Advanced OCR and AI-powered blood report analysis service for MoodBites platform. Extracts data from blood test images/PDFs and provides health insights with dietary recommendations.

## Features
- 📸 **OCR Analysis**: Extract text from blood report images using Tesseract.js
- 📄 **PDF Support**: Parse PDF blood reports
- 🧠 **AI Insights**: Generate health insights from blood test results
- 🥗 **Diet Recommendations**: Personalized nutrition advice based on results
- ☁️ **Cloud Storage**: Secure file storage with Cloudinary
- 📊 **Data Analysis**: Analyze common blood test parameters
- 🔒 **JWT Authentication**: Secure API endpoints

## Installation

### 1. Install Dependencies
```bash
cd blood-report-service
npm install
```

### 2. Environment Setup
Create `.env` file with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodbites
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

### 3. Start Service
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Health Check
```http
GET /health
```

### Analyze Blood Report
```http
POST /api/blood-report/analyze
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- bloodReport: File (image/PDF)
- userId: String
```

**Response:**
```json
{
  "success": true,
  "reportId": "report_id",
  "extractedData": {
    "patientName": "John Doe",
    "reportDate": "2024-01-15",
    "labName": "Medical Lab",
    "tests": [
      {
        "name": "Hemoglobin",
        "value": "14.2",
        "unit": "g/dL",
        "normalRange": "12.0-15.5",
        "status": "normal"
      }
    ]
  },
  "insights": [
    {
      "type": "warning",
      "title": "Cardiovascular Risk",
      "message": "Elevated cholesterol levels detected"
    }
  ],
  "recommendations": [
    "Reduce saturated fat intake",
    "Increase fiber consumption"
  ]
}
```

### Get Report History
```http
GET /api/blood-report/history/:userId
Authorization: Bearer <jwt_token>
```

### Get Specific Report
```http
GET /api/blood-report/:reportId
Authorization: Bearer <jwt_token>
```

## Supported Blood Tests

The service can extract and analyze:

- **Hemoglobin** (Hgb/Hb)
- **Total Cholesterol**
- **HDL Cholesterol**
- **LDL Cholesterol**
- **Triglycerides**
- **Glucose (Fasting)**
- **HbA1c**
- **Vitamin D**
- **Vitamin B12**
- **Iron**

## Health Insights

The AI generates insights for:
- 🚨 **Cardiovascular Risk**: High cholesterol levels
- 📈 **Diabetes Risk**: Elevated glucose/HbA1c
- 💊 **Vitamin Deficiencies**: Low vitamin D/B12
- 🩸 **Anemia Risk**: Low hemoglobin/iron

## Dietary Recommendations

Personalized recommendations based on results:
- 🥗 **Mediterranean Diet**: For cholesterol management
- 🏃 **Exercise Plans**: For glucose metabolism
- ☀️ **Vitamin D**: Supplementation guidance
- 🌾 **Fiber Intake**: For cardiovascular health

## File Support

- **Images**: JPEG, PNG (up to 10MB)
- **Documents**: PDF (up to 10MB)
- **Processing**: Auto image enhancement for better OCR
- **Storage**: Secure Cloudinary cloud storage

## Database Schema

```javascript
{
  userId: ObjectId,
  fileName: String,
  fileUrl: String,
  extractedText: String,
  analysisResults: {
    patientName: String,
    reportDate: String,
    labName: String,
    tests: Array
  },
  insights: Array,
  recommendations: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

Test the service with sample blood reports:

```bash
# Health check
curl http://localhost:8000/health

# Upload report (with authentication)
curl -X POST http://localhost:8000/api/blood-report/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "bloodReport=@sample_report.jpg" \
  -F "userId=USER_ID"
```

## Integration with Frontend

The service integrates with the `BloodReport.jsx` component:

1. **File Upload**: Drag & drop or file picker
2. **Real-time Analysis**: Progress indicators during OCR
3. **Results Display**: Beautiful visualization of results
4. **Insights Cards**: Color-coded health alerts
5. **Recommendations**: Actionable dietary advice

## Security

- 🔐 **JWT Authentication**: All endpoints protected
- 📁 **File Validation**: Type and size restrictions
- 🔒 **Data Encryption**: Secure data transmission
- 🏥 **HIPAA Compliant**: Medical data protection

## Performance

- ⚡ **Fast OCR**: Optimized Tesseract processing
- 🖼️ **Image Enhancement**: Pre-processing for accuracy
- 📦 **Efficient Storage**: Compressed cloud storage
- 🚀 **Scalable**: Horizontal scaling support

## Error Handling

- 📋 **Validation**: File type and size validation
- 🔄 **Retry Logic**: Robust error recovery
- 📝 **Detailed Logs**: Comprehensive error tracking
- 🚨 **User Feedback**: Clear error messages

## Ready to Use! 🎉

Your blood report analysis service is fully configured and ready to process medical reports with AI-powered insights and dietary recommendations!
