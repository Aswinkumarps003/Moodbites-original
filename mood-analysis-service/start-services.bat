@echo off
echo 🚀 Starting MoodBites Services...
echo.

echo 📊 Starting FastAPI Mood Detection Service...
start "Mood Detection Service" cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo 🍽️ Starting Express Recipe Service...
start "Recipe Service" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo 🤖 Starting Chatbot Service...
start "Chatbot Service" cmd /k "cd ../chat-service && npm start"
timeout /t 3 /nobreak >nul

echo.
echo ✅ All three services are starting up!
echo.
echo 🌐 Mood Detection: http://localhost:8000
echo 🍽️ Recipe Service: http://localhost:3001
echo 🤖 Chatbot Service: http://localhost:3002
echo 📱 Frontend: http://localhost:5173
echo.
echo 🔑 Make sure you have set:
echo    - SPOONACULAR_API_KEY (for recipes)
echo    - OPENAI_API_KEY (for chatbot AI)
echo.
echo Press any key to close this window...
pause >nul
