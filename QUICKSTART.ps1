# RocketWheel Quick Start Script (PowerShell)
# Run: .\QUICKSTART.ps1

Write-Host "`n=================================" -ForegroundColor Green
Write-Host "  RocketWheel Quick Start Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will install dependencies for both backend and frontend.`n"

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/`n"
    exit 1
}

# Check MongoDB
Write-Host "`nChecking MongoDB..." -ForegroundColor Cyan
try {
    $mongoCheck = mongosh --eval "db.adminCommand('ping')" 2>$null
    Write-Host "[OK] MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] MongoDB may not be running" -ForegroundColor Yellow
    Write-Host "Start MongoDB before running the system.`n"
}

# Install backend
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Cyan
Push-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Backend installation failed" -ForegroundColor Red
    exit 1
}
Pop-Location

# Install frontend
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Cyan
Push-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Frontend installation failed" -ForegroundColor Red
    exit 1
}
Pop-Location

Write-Host "`n=================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host @"

Next steps:

1. Ensure MongoDB is running (open a new PowerShell):
   mongosh

2. Terminal 1 - Backend:
   cd C:\Users\prade\rocketwheel\backend
   npm run dev
   (Keep this running, you'll see "Server running on port 4000")

3. Terminal 2 - Frontend:
   cd C:\Users\prade\rocketwheel\frontend
   npm start
   (React will auto-open http://localhost:3000)

4. Browser:
   Visit http://localhost:3000

Documentation:
  - Setup Guide:        SETUP.md
  - API Testing:        API_TESTING.md
  - Architecture:       ARCHITECTURE.md
  - Main README:        README.md

Quick test:
  - Click "Admin Login" -> login
  - Click "Vendor Login" -> register a vendor
  - Wait for admin approval
  - View menu, add products, download QR

Questions? Check SETUP.md for troubleshooting.

"@ -ForegroundColor Yellow

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
