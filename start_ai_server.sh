#!/bin/bash

# Start the AI Assessment Flask Server
echo "Starting AI Assessment Flask Server on port 5002..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

# Install requirements
echo "Installing Python requirements..."
pip install -r requirements.txt

# Start the Flask server
echo "Starting Flask server..."
python ai_assessment_server.py
