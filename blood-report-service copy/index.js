import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// The direct import below causes issues in an ES module environment.
// import pdf from 'pdf-parse';

// --- WORKAROUND for pdf-parse import issue ---
// This safely imports the CommonJS module into the ES module scope.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
// --- End of workaround ---

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Configuration ---
// It's best practice to use environment variables for sensitive data
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blood_reports_db';
const PYTHON_OCR_URL = 'http://localhost:5001/extract-text'; // URL for the Python service
const PORT = process.env.PORT || 8000;


cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Use memory storage to handle the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Database Connection ---
let db;
let reportsCollection;

// Create a new MongoClient instance
const client = new MongoClient(MONGO_URI);

async function startServer() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log("✅ Connected successfully to MongoDB");

        // Set up DB and collection references
        db = client.db(); // Defaults to the DB in your connection string
        reportsCollection = db.collection('reports');

        // Start the Express server only after the database connection is successful
        app.listen(PORT, () => {
            console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB', err);
        process.exit(1); // Exit the application if the database connection fails
    }
}


// --- Helper Functions ---

// Placeholder for your actual analysis logic
function analyzeBloodReport(text, patientName) {
    // This is a simplified example. A real implementation would use more sophisticated regex or NLP.
    const tests = [];
    const lines = text.split('\n');
    lines.forEach(line => {
        const match = line.match(/([\w\s.-]+)\s+([\d.]+)\s*([\w\/]+)/);
        if (match) {
            const [, name, value, unit] = match;
            // Simple status logic
            let status = 'normal';
            if (name.toLowerCase().includes('hemoglobin') && parseFloat(value) > 17) status = 'high';
            if (name.toLowerCase().includes('hemoglobin') && parseFloat(value) < 13) status = 'low';
            
            tests.push({ name: name.trim(), value: value, unit: unit, status: status });
        }
    });
    return { patientName, tests };
}

async function extractTextFromPDF(pdfBuffer) {
    const data = await pdf(pdfBuffer);
    return data.text;
}

// It communicates with the Python OCR service
async function extractTextFromImageWithValidation(imageBuffer) {
    try {
        // Convert buffer to base64 data URI, which the Python service can easily handle.
        const base64Image = imageBuffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64Image}`; // Assuming jpeg, adjust if needed

        const response = await axios.post(PYTHON_OCR_URL, {
            image_data: dataUri,
        });

        return response.data; // The Python service will return { success, text, validation }
    } catch (error) {
        if (error.response) {
            console.error('Error from Python OCR service:', error.response.data);
            throw new Error(`OCR Service Error: ${error.response.data.reason || 'Failed to process image'}`);
        } else if (error.request) {
            console.error('No response from Python OCR service:', error.request);
            throw new Error('OCR Service is unavailable. Please check if it is running.');
        } else {
            console.error('Axios error:', error.message);
            throw new Error('Failed to communicate with the OCR service.');
        }
    }
}


// --- API Routes ---

app.post('/api/blood-report/analyze', upload.single('bloodReport'), async (req, res) => {
 try {
   if (!req.file) {
     return res.status(400).json({ error: 'No file uploaded. Make sure the file is sent with the key "bloodReport".' });
   }

   const { userId } = req.body;
   const file = req.file;

   console.log('📋 Analyzing blood report:', file.originalname);

   // Upload to Cloudinary
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

   console.log('☁️ File uploaded to Cloudinary:', uploadResult.secure_url);

   // Extract text using Python OCR service with validation
   let extractedText = '';
   
   if (file.mimetype === 'application/pdf') {
     extractedText = await extractTextFromPDF(file.buffer);
   } else {
     const pythonResult = await extractTextFromImageWithValidation(file.buffer);
     if (!pythonResult.success) {
        // Handle validation failure from Python
        return res.status(400).json({
            success: false,
            error: 'The uploaded file does not appear to be a blood report.',
            details: pythonResult.reason || 'File validation failed'
        });
     }
     extractedText = pythonResult.text;
   }

   console.log('📝 Text extracted, length:', extractedText.length);
   console.log('✅ File validated as blood report.');


   // Analyze the extracted text
   const patientName = 'Patient'; // Default since auth is disabled
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

   recommendations.push('Consult with your healthcare provider about these results');
   recommendations.push('Maintain a balanced diet rich in fruits and vegetables');

   // Save to database
    const reportToSave = {
      userId: userId,
      fileName: file.originalname,
      fileUrl: uploadResult.secure_url,
      extractedText: extractedText,
      analysisResults: analysisResults,
      insights: insights,
      recommendations: recommendations,
      createdAt: new Date(),
    };
    const savedReport = await reportsCollection.insertOne(reportToSave);


   console.log('💾 Blood report saved to database');

   // Return analysis results
   res.json({
     success: true,
     message: 'Blood report analyzed successfully',
     reportId: savedReport.insertedId,
     extractedData: analysisResults,
     insights: insights,
     recommendations: recommendations,
     fileUrl: uploadResult.secure_url
   });

 } catch (error) {
   console.error('❌ Blood report analysis error:', error);
   res.status(500).json({ 
     error: 'Failed to analyze blood report',
     details: error.message 
   });
 }
});

// Start the server
startServer();

