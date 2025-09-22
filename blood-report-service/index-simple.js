import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import Jimp from 'jimp';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Cloudinary (optional - will work without it)
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured');
} catch (error) {
  console.log('⚠️ Cloudinary not configured - using local processing only');
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// MongoDB Schema for Blood Reports
const bloodReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: false },
  extractedText: { type: String, required: true },
  analysisResults: {
    patientName: String,
    reportDate: String,
    labName: String,
    tests: [{
      name: String,
      value: String,
      unit: String,
      normalRange: String,
      status: String
    }]
  },
  insights: [{
    type: String,
    title: String,
    message: String
  }],
  recommendations: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BloodReport = mongoose.model('BloodReport', bloodReportSchema);

// Connect to MongoDB (optional - will work without it)
try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('⚠️ MongoDB connection failed - using in-memory storage'));
} catch (error) {
  console.log('⚠️ MongoDB not configured - using in-memory storage');
}

// Auth middleware (simplified)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Helper function to preprocess image
const preprocessImage = async (buffer) => {
  try {
    const image = await Jimp.read(buffer);
    
    // Enhance image for better OCR
    image
      .greyscale()
      .contrast(0.3)
      .normalize()
      .resize(image.bitmap.width * 2, image.bitmap.height * 2, Jimp.RESIZE_BICUBIC);

    return await image.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return buffer; // Return original if preprocessing fails
  }
};

// Helper function to extract text from image using Python OCR service
const extractTextFromImage = async (buffer) => {
  try {
    // Convert buffer to base64 for Python service
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    
    console.log('🐍 Calling Python OCR service...');
    
    // Call Python OCR service
    const response = await fetch('http://localhost:5001/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_data: dataUrl
      })
    });

    if (!response.ok) {
      throw new Error(`Python OCR service error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.reason || 'Python OCR extraction failed');
    }

    console.log('✅ Python OCR completed, text length:', result.text.length);
    return result.text;
    
  } catch (error) {
    console.error('Python OCR Error:', error);
    // Fallback to Node.js Tesseract if Python service is unavailable
    console.log('🔄 Falling back to Node.js Tesseract...');
    return await extractTextFromImageFallback(buffer);
  }
};

// Fallback function using Node.js Tesseract
const extractTextFromImageFallback = async (buffer) => {
  try {
    const processedBuffer = await preprocessImage(buffer);
    
    const { data: { text } } = await Tesseract.recognize(processedBuffer, 'eng', {
      logger: m => console.log('Fallback OCR Progress:', m.status, m.progress)
    });
    
    return text;
  } catch (error) {
    console.error('Fallback OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Helper function to analyze extracted text
const analyzeBloodReport = (extractedText, patientName) => {
  const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Common blood test patterns
  const testPatterns = [
    { name: 'Hemoglobin', regex: /hemoglobin|hgb|hb[\s:]*(\d+\.?\d*)/i, unit: 'g/dL', normalRange: '12.0-15.5' },
    { name: 'Total Cholesterol', regex: /total cholesterol|cholesterol[\s:]*(\d+\.?\d*)/i, unit: 'mg/dL', normalRange: '<200' },
    { name: 'HDL Cholesterol', regex: /hdl|hdl cholesterol[\s:]*(\d+\.?\d*)/i, unit: 'mg/dL', normalRange: '>40' },
    { name: 'LDL Cholesterol', regex: /ldl|ldl cholesterol[\s:]*(\d+\.?\d*)/i, unit: 'mg/dL', normalRange: '<100' },
    { name: 'Triglycerides', regex: /triglycerides|tg[\s:]*(\d+\.?\d*)/i, unit: 'mg/dL', normalRange: '<150' },
    { name: 'Glucose', regex: /glucose|sugar[\s:]*(\d+\.?\d*)/i, unit: 'mg/dL', normalRange: '70-100' },
    { name: 'HbA1c', regex: /hba1c|a1c[\s:]*(\d+\.?\d*)/i, unit: '%', normalRange: '<5.7' },
    { name: 'Vitamin D', regex: /vitamin d|vit d[\s:]*(\d+\.?\d*)/i, unit: 'ng/mL', normalRange: '30-100' },
    { name: 'Vitamin B12', regex: /vitamin b12|b12[\s:]*(\d+\.?\d*)/i, unit: 'pg/mL', normalRange: '200-900' },
    { name: 'Iron', regex: /iron[\s:]*(\d+\.?\d*)/i, unit: 'μg/dL', normalRange: '60-170' }
  ];

  const tests = [];
  const insights = [];
  const recommendations = [];

  // Extract test values
  for (const pattern of testPatterns) {
    for (const line of lines) {
      const match = line.match(pattern.regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        let status = 'normal';
        
        // Determine status based on normal ranges (simplified logic)
        if (pattern.name === 'Total Cholesterol' && value > 200) status = 'high';
        else if (pattern.name === 'HDL Cholesterol' && value < 40) status = 'low';
        else if (pattern.name === 'LDL Cholesterol' && value > 100) status = 'high';
        else if (pattern.name === 'Triglycerides' && value > 150) status = 'high';
        else if (pattern.name === 'Glucose' && value > 100) status = 'high';
        else if (pattern.name === 'HbA1c' && value > 5.7) status = 'high';
        else if (pattern.name === 'Vitamin D' && value < 30) status = 'low';
        else if (pattern.name === 'Hemoglobin' && (value < 12.0 || value > 15.5)) status = value < 12.0 ? 'low' : 'high';

        tests.push({
          name: pattern.name,
          value: match[1],
          unit: pattern.unit,
          normalRange: pattern.normalRange,
          status: status
        });
        break;
      }
    }
  }

  // Generate insights based on test results
  const highCholesterol = tests.find(t => t.name === 'Total Cholesterol' && t.status === 'high');
  const highGlucose = tests.find(t => t.name === 'Glucose' && t.status === 'high');
  const lowVitaminD = tests.find(t => t.name === 'Vitamin D' && t.status === 'low');

  if (highCholesterol) {
    insights.push({
      type: 'warning',
      title: 'Cardiovascular Risk',
      message: 'Elevated cholesterol levels may increase cardiovascular risk'
    });
    recommendations.push('Reduce saturated fat intake and increase fiber consumption');
    recommendations.push('Consider Mediterranean diet for cholesterol management');
  }

  if (highGlucose) {
    insights.push({
      type: 'info',
      title: 'Pre-diabetic Range',
      message: 'Glucose levels suggest monitoring for diabetes risk'
    });
    recommendations.push('Regular exercise (150 minutes/week) to improve glucose metabolism');
    recommendations.push('Monitor carbohydrate intake and choose complex carbs');
  }

  if (lowVitaminD) {
    insights.push({
      type: 'alert',
      title: 'Vitamin D Deficiency',
      message: 'Low vitamin D levels detected - consider supplementation'
    });
    recommendations.push('Vitamin D supplementation under medical supervision');
    recommendations.push('Increase sun exposure and vitamin D rich foods');
  }

  // Extract basic report info
  const reportDate = extractDate(extractedText);
  const labName = extractLabName(extractedText);

  return {
    patientName: patientName,
    reportDate: reportDate,
    labName: labName,
    tests: tests
  };
};

// Helper function to extract date from text
const extractDate = (text) => {
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{1,2}-\d{1,2}-\d{4})/,
    /(\d{4}-\d{1,2}-\d{1,2})/
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  return new Date().toISOString().split('T')[0]; // Default to today
};

// Helper function to extract lab name
const extractLabName = (text) => {
  const lines = text.split('\n').slice(0, 5); // Check first 5 lines
  const labKeywords = ['lab', 'laboratory', 'medical', 'center', 'hospital', 'clinic'];
  
  for (const line of lines) {
    if (labKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      return line.trim();
    }
  }
  
  return 'Medical Laboratory';
};

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Blood Report Analysis Service (Simplified)',
    timestamp: new Date().toISOString(),
    features: ['Image OCR', 'Blood Test Analysis', 'Health Insights']
  });
});

// Analyze blood report
app.post('/api/blood-report/analyze', authenticateToken, upload.single('bloodReport'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    const file = req.file;

    console.log('📋 Analyzing blood report:', file.originalname);

    // Upload to Cloudinary (optional)
    let fileUrl = null;
    try {
      if (cloudinary.config().cloud_name) {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'blood-reports',
              public_id: `${userId}_${Date.now()}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        fileUrl = uploadResult.secure_url;
        console.log('☁️ File uploaded to Cloudinary:', fileUrl);
      }
    } catch (cloudinaryError) {
      console.log('⚠️ Cloudinary upload failed, continuing without cloud storage');
    }

    // Extract text using OCR
    const extractedText = await extractTextFromImage(file.buffer);
    console.log('📝 Text extracted, length:', extractedText.length);

    // Analyze the extracted text
    const patientName = req.user.name || 'Patient';
    const analysisResults = analyzeBloodReport(extractedText, patientName);

    // Generate insights and recommendations
    const insights = [];
    const recommendations = [];

    // Add insights based on abnormal results
    const abnormalTests = analysisResults.tests.filter(test => test.status !== 'normal');
    
    if (abnormalTests.length > 0) {
      insights.push({
        type: 'info',
        title: 'Abnormal Results Detected',
        message: `${abnormalTests.length} test(s) show values outside normal range`
      });
    }

    // Add general recommendations
    recommendations.push('Consult with your healthcare provider about these results');
    recommendations.push('Maintain a balanced diet rich in fruits and vegetables');
    recommendations.push('Stay hydrated and exercise regularly');

    // Save to database (optional)
    let reportId = null;
    try {
      if (mongoose.connection.readyState === 1) {
        const bloodReport = new BloodReport({
          userId: userId,
          fileName: file.originalname,
          fileUrl: fileUrl,
          extractedText: extractedText,
          analysisResults: analysisResults,
          insights: insights,
          recommendations: recommendations
        });

        await bloodReport.save();
        reportId = bloodReport._id;
        console.log('💾 Blood report saved to database');
      }
    } catch (dbError) {
      console.log('⚠️ Database save failed, continuing without persistence');
    }

    // Return analysis results
    res.json({
      success: true,
      message: 'Blood report analyzed successfully',
      reportId: reportId,
      extractedData: analysisResults,
      insights: insights,
      recommendations: recommendations,
      fileUrl: fileUrl
    });

  } catch (error) {
    console.error('❌ Blood report analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze blood report',
      details: error.message 
    });
  }
});

// Get user's blood reports
app.get('/api/blood-report/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        reports: [],
        message: 'Database not connected - no history available'
      });
    }
    
    const reports = await BloodReport.find({ userId: userId })
      .sort({ createdAt: -1 })
      .select('-extractedText'); // Exclude large text field

    res.json({
      success: true,
      reports: reports
    });

  } catch (error) {
    console.error('❌ Error fetching blood report history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blood report history',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🩸 Blood Report Service (Simplified) running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/blood-report/analyze`);
  console.log(`✅ Features: Image OCR, Blood Test Analysis, Health Insights`);
  console.log(`⚠️ Note: PDF support disabled, MongoDB and Cloudinary optional`);
});
