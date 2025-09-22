@echo off
echo 🩸 Starting Blood Report Analysis with Python OCR Validation...
echo.

echo 🐍 Starting Python OCR Service (Port 5001)...
start "Python OCR Service" cmd /k "cd blood-report-service && python bloodreport.py"

echo.
echo ⏳ Waiting for Python service to start...
timeout /t 5 /nobreak > nul

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
echo CLOUDINARY_CLOUD_NAME=your_cloud_name >> .env
echo CLOUDINARY_API_KEY=your_api_key >> .env
echo CLOUDINARY_API_SECRET=your_api_secret >> .env

echo.
echo 🚀 Starting Blood Report Service (Port 8000)...
echo 📋 Health check: http://localhost:8000/health
echo 🔗 API endpoint: http://localhost:8000/api/blood-report/analyze
echo 🐍 Python OCR: http://localhost:5001/extract-text
echo.
echo ✅ Features:
echo   - Python OCR with Tesseract (primary)
echo   - Blood report validation
echo   - Cloudinary file storage
echo   - MongoDB data persistence
echo   - Health insights generation
echo   - Dietary recommendations
echo   - Error popup notifications
echo.

call npm start

pause


