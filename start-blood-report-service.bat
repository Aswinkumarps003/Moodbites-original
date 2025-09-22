@echo off
echo 🩸 Starting Blood Report Analysis Service...
echo.

cd blood-report-service

echo 📦 Installing dependencies...
call npm install

echo.
echo 🚀 Starting Blood Report Service on port 8000...
echo 📋 Health check: http://localhost:8000/health
echo 🔗 API endpoint: http://localhost:8000/api/blood-report/analyze
echo.

call npm start

pause
