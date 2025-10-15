#!/bin/bash

# ATS Candidate Tracker - Development Startup Script

echo "🚀 Starting ATS Candidate Tracker Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is installed and running."
    echo "   You can use MongoDB Atlas or a local installation."
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Backend dependencies already installed."
fi

echo "Installing frontend dependencies..."
cd ../frontend/ats-tracker
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Frontend dependencies already installed."
fi

# Check for environment file
echo "🔧 Checking configuration..."
cd ../../backend
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit backend/.env with your configuration before starting the servers."
    echo "   Required: MONGODB_URI, JWT_SECRET"
fi

# Start servers
echo "🎯 Starting development servers..."
echo ""

# Start backend in background
echo "Starting backend server on port 5000..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 5173..."
cd ../frontend/ats-tracker
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
