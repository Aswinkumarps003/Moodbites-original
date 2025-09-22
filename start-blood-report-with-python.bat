@echo off
echo 🩸 Starting Blood Report Analysis with Python OCR...
echo.

echo 🐍 Starting Python OCR Service...
start "Python OCR Service" cmd /k "cd certificate verification && python ocr_service.py"

echo.
echo ⏳ Waiting for Python service to start...
timeout /t 3 /nobreak > nul

echo.
echo 📦 Installing Node.js dependencies...
cd blood-report-service
call npm install

echo.
echo 🔧 Creating .env file...
echo MONGODB_URI=mongodb+srv://Aswinkumarps:A123@moodbites.0pr1hwz.mongodb.net/?retryWrites=true^&w=majority^&appName=moodbites > .env
echo JWT_SECRET=your_jwt_secret_key >> .env
echo PORT=8000 >> .env
echo NODE_ENV=development >> .env

echo.
echo 🚀 Starting Blood Report Service...
echo 📋 Health check: http://localhost:8000/health
echo 🔗 API endpoint: http://localhost:8000/api/blood-report/analyze
echo 🐍 Python OCR: http://localhost:5001/extract-text
echo.
echo ✅ Features:
echo   - Python OCR with Tesseract (primary)
echo   - Node.js Tesseract (fallback)
echo   - Blood test analysis
echo   - Health insights generation
echo   - Dietary recommendations
echo   - Validation with confidence scoring
echo.

call npm start

pause


