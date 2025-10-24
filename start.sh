#!/bin/bash

echo "🚀 Starting Threaded Comment System..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

# Install root dependencies (concurrently)
echo "Installing root dependencies..."
cd ..
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo "✅ All dependencies installed successfully!"
echo ""
echo "🎯 Starting the application..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev
