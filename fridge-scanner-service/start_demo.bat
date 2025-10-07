@echo off
echo Starting Fridge Scanner Demo...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo Starting backend server...
start "Fridge Scanner Backend" cmd /k "python backend.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Fridge Scanner Frontend" cmd /k "python serve_frontend.py"

echo.
echo Demo started successfully!
echo.
echo Backend API: http://localhost:4005
echo Frontend UI: http://localhost:8080
echo.
echo Press any key to exit...
pause >nul
