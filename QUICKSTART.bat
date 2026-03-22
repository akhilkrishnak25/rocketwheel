@echo off
REM RocketWheel Quick Start Script for Windows

echo.
echo ===================================
echo   RocketWheel Quick Start Setup
echo ===================================
echo.
echo This script will help you set up RocketWheel locally.
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB is running
) else (
    echo [WARNING] MongoDB does not appear to be running
    echo Please start MongoDB before continuing:
    echo   - Windows Service: Services app ^> MongoDB ^> Start
    echo   - Or manually: "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
    echo.
    pause
)

echo.
echo Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Setup Complete!
echo ===================================
echo.
echo Next steps:
echo.
echo 1. Open PowerShell Terminal 1:
echo    cd C:\Users\prade\rocketwheel\backend
echo    npm run dev
echo.
echo 2. Open PowerShell Terminal 2:
echo    cd C:\Users\prade\rocketwheel\frontend
echo    npm start
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo For detailed setup guide, see: SETUP.md
echo For architecture details, see: ARCHITECTURE.md
echo.
pause
