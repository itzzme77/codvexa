@echo off
echo ================================================
echo Face Recognition Server - Quick Start
echo ================================================
echo.

cd backend\face_recognition

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
echo This may take 5-10 minutes on first run...
pip install -r requirements.txt

echo.
echo ================================================
echo Starting Face Recognition API Server
echo ================================================
echo Server will run on http://0.0.0.0:5000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

python api_server.py

pause
