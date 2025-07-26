# Start the AI Assessment Flask Server
Write-Host "Starting AI Assessment Flask Server on port 5002..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install requirements
Write-Host "Installing Python requirements..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start the Flask server
Write-Host "Starting Flask server..." -ForegroundColor Green
python ai_assessment_server.py
