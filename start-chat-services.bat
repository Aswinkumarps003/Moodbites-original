@echo off
echo Starting MoodBites Chat Services...
echo.

echo Starting Chat Service on port 3006...
start "Chat Service" cmd /k "cd chat-service && npm run dev"

echo.
echo Chat Service started!
echo.
echo Services running:
echo - Chat Service: http://localhost:3006
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
