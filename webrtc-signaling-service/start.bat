@echo off
echo Starting WebRTC Signaling Service...
cd /d "%~dp0"
npm install
node server.js
pause
