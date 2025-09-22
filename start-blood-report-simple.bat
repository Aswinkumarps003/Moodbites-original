@echo off
echo 🩸 Starting Blood Report Analysis Service (Simple Version)...
echo.

cd blood-report-service

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Creating minimal .env file...
echo MONGODB_URI=mongodb+srv://Aswinkumarps:A123@moodbites.0pr1hwz.mongodb.net/?retryWrites=true^&w=majority^&appName=moodbites > .env
echo JWT_SECRET=your_jwt_secret_key >> .env
echo PORT=8000 >> .env
echo NODE_ENV=development >> .env

echo.
echo 🚀 Starting Blood Report Service on port 8000...
echo 📋 Health check: http://localhost:8000/health
echo 🔗 API endpoint: http://localhost:8000/api/blood-report/analyze
echo.
echo ✅ Features:
echo   - Image OCR with Tesseract.js
echo   - Blood test analysis
echo   - Health insights generation
echo   - Dietary recommendations
echo   - Optional MongoDB storage
echo   - Optional Cloudinary storage
echo.
echo ⚠️  Note: PDF support temporarily disabled
echo.

call npm start

pause


