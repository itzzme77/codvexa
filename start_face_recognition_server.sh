# Face Recognition Server - Quick Start (macOS/Linux)

echo "================================================"
echo "Face Recognition Server - Quick Start"
echo "================================================"
echo ""

cd backend/face_recognition

echo "Checking Python installation..."
python3 --version
if [ $? -ne 0 ]; then
    echo "ERROR: Python is not installed or not in PATH"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

echo ""
echo "Installing dependencies..."
echo "This may take 5-10 minutes on first run..."
pip3 install -r requirements.txt

echo ""
echo "================================================"
echo "Starting Face Recognition API Server"
echo "================================================"
echo "Server will run on http://0.0.0.0:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

python3 api_server.py
