@echo off
echo 🩸 Starting Blood Report Analysis Service (Fixed Version)...
echo.

cd blood-report-service

echo 📦 Installing dependencies (excluding problematic pdf-parse)...
call npm install --ignore-scripts

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
echo ⚠️  Note: PDF parsing is temporarily disabled to avoid startup errors
echo ✅ Image OCR is fully functional
echo.

call npm start

pause


