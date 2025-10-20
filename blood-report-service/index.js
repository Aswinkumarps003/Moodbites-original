import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Configurations ---

const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- MongoDB Connection & Schema ---
const bloodReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  extractedText: { type: String, required: true },
  analysisResults: {
    patientName: String,
    patientAge: String,
    patientGender: String,
    billNo: String,
    billDate: String,
    collectedOn: String,
    reportOn: String,
    tests: [{
      name: String,
      value: String,
      unit: String,
      normalRange: String,
      status: String
    }],
  },
  insights: [{ type: Object }],
  recommendations: [String],
  createdAt: { type: Date, default: Date.now },
});

const BloodReport = mongoose.model('BloodReport', bloodReportSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Helper Functions ---

// 1. Call Python service for OCR and initial validation
const callPythonOCR = async (buffer, mimeType) => {
  try {
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    
    console.log(`🐍 Calling Python OCR service for ${mimeType}...`);
    const response = await fetch('http://localhost:5001/extract-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_data: dataUrl })
    });

    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      console.log('✅ Python OCR completed.');
    } else {
      console.warn(`⚠️ Python OCR returned status ${response.status}`);
    }
    return { status: response.status, body };
  } catch (error) {
    console.error('Python OCR Error:', error);
    return { status: 500, body: { success: false, reason: 'Python OCR unreachable' } };
  }
};

// 2. ** UPGRADED AI-POWERED ANALYSIS FUNCTION **
// This function sends the OCR text to a Generative AI model with a more robust prompt.
const extractStructuredDataWithAI = async (text) => {
  console.log('🤖 Sending text to AI for structured data extraction...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const schema = {
    type: "OBJECT",
    properties: {
      patientName: { type: "STRING" },
      patientAge: { type: "STRING" },
      patientGender: { type: "STRING" },
      billNo: { type: "STRING" },
      billDate: { type: "STRING" },
      collectedOn: { type: "STRING" },
      reportOn: { type: "STRING" },
      tests: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            value: { type: "STRING" },
            unit: { type: "STRING" },
            normalRange: { type: "STRING" },
            status: { type: "STRING", description: "Determine if the value is 'Normal', 'High', 'Low', or 'Borderline High' based on the normalRange." },
          },
          required: ["name", "value", "normalRange", "status"]
        }
      }
    }
  };
  
  // ** NEW, MORE DETAILED PROMPT **
  const prompt = `
    You are an expert medical data analyst. Your task is to accurately extract information from the following OCR-scanned blood report text.
    
    **Instructions:**
    1.  **Be Precise:** Extract the values EXACTLY as they appear in the text. Do not invent, hallucinate, or estimate any numbers or text.
    2.  **Handle OCR Errors:** The text may contain errors (e.g., "motel" instead of "mg/dL", "Mate" instead of "Male"). Use context to correct these where obvious.
    3.  **Complete All Fields:** Fill every field in the provided JSON schema. If a value is not present in the text, use "N/A" as the value.
    4.  **Determine Status:** For each test, analyze the 'Observed Value' against the 'Biological Reference Range' to determine the 'status'. The status must be one of: 'Normal', 'High', 'Low', or 'Borderline High'.

    **Blood Report Text to Analyze:**
    ---
    ${text}
    ---
  `;


  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`AI Model API error: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    if (!result.candidates || !result.candidates[0].content.parts[0].text) {
        throw new Error("Received an invalid or empty response from the AI model.");
    }
    const jsonText = result.candidates[0].content.parts[0].text;
    console.log('✅ AI analysis successful. Received structured JSON.');
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("❌ Error during AI data extraction:", error);
    throw new Error("The AI model failed to extract structured data from the text.");
  }
};


// --- API Route ---
app.post('/api/blood-report/analyze', upload.single('bloodReport'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { userId } = req.body;
    const file = req.file;

    console.log('📋 Analyzing blood report (no file storage):', file.originalname);

    // Step 1: Get raw text from Python OCR service (with PDF fallback)
    const ocrResponse = await callPythonOCR(file.buffer, file.mimetype);
    let ocrText = '';
    if (ocrResponse.status === 200) {
      ocrText = ocrResponse.body.text || '';
      if (!ocrResponse.body.success || !ocrText) {
        return res.status(400).json({
          success: false,
          error: 'File validation failed',
          validation: ocrResponse.body.validation || { reason: ocrResponse.body.reason || 'Invalid report' }
        });
      }
    } else if (file.mimetype === 'application/pdf') {
      // Any non-200 from Python for PDFs → fallback to Node pdf-parse
      console.log('📄 Falling back to Node PDF text extraction...');
      const parsed = await pdfParse(file.buffer);
      ocrText = (parsed.text || '').trim();
      if (!ocrText) {
        return res.status(400).json({
          success: false,
          error: 'File validation failed',
          validation: { reason: 'Unable to extract text from PDF.' }
        });
      }
      const textLower = ocrText.toLowerCase();
      const looksLikeReport = /(lipid profile|cholesterol|mg\/dl|name of investigation)/i.test(textLower);
      if (!looksLikeReport) {
        return res.status(400).json({
          success: false,
          error: 'File validation failed',
          validation: { reason: 'The uploaded file does not appear to be a blood report.' }
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        validation: ocrResponse.body && (ocrResponse.body.validation || { reason: ocrResponse.body.reason || 'OCR service error' })
      });
    }

    // Step 2: Use the AI model to parse the raw text into structured JSON
    const analysisResults = await extractStructuredDataWithAI(ocrText);

    // Step 3: Generate insights (this can also be an AI task in the future)
    const insights = [];
    if (analysisResults.tests.some(t => t.status && t.status.toLowerCase() !== 'normal')) {
        insights.push({
            type: 'warning',
            title: 'Abnormal Results Detected',
            message: 'One or more tests are outside the normal range.'
        });
    }

    // Step 4: Save the structured data to the database (store text only, no fileUrl)
    const bloodReport = new BloodReport({
      userId: userId || new mongoose.Types.ObjectId(),
      fileName: file.originalname,
      extractedText: ocrText,
      analysisResults, // Use the structured data from the AI model
      insights,
      recommendations: ['Consult with your healthcare provider about these results.']
    });
    await bloodReport.save();

    console.log('💾 AI-processed report saved to database.');
    
    res.json({
      success: true,
      message: 'Blood report analyzed successfully with AI',
      reportId: bloodReport._id,
      data: bloodReport,
    });

  } catch (error) {
    console.error('❌ Top-level analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze blood report',
      details: error.message 
    });
  }
});

// Fetch latest analyzed blood report for a user
app.get('/api/blood-report/latest/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const report = await BloodReport.findOne({ userId }).sort({ createdAt: -1 });
    if (!report) {
      return res.status(404).json({ message: 'No blood report found for user' });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('❌ Fetch latest blood report error:', error);
    res.status(500).json({ message: 'Failed to fetch latest blood report' });
  }
});

// Start server
// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'blood-report-service', 
    timestamp: new Date().toISOString(),
    message: 'Blood Report Service is running successfully!'
  });
});

// Health check endpoint for /health
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'blood-report-service', 
    timestamp: new Date().toISOString(),
    message: 'Blood Report Service is healthy!'
  });
});

app.listen(PORT, () => {
  console.log(`🩸 Blood Report Service running on port ${PORT}`);
});

