@echo off
REM Waste Management System - Quick Start Script for Windows

echo.
echo 🌍 Waste Management System dApp - Quick Start
echo =============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do echo ✅ Node.js found: %%i
echo.

REM Install dependencies
echo 📦 Installing dependencies...
echo.

echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo ✅ Backend dependencies installed
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo ✅ Frontend dependencies installed
echo.

echo Installing contract dependencies...
cd contracts
call npm install
cd ..
echo ✅ Contract dependencies installed
echo.

REM Copy environment files
echo ⚙️  Setting up environment files...
echo.

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✅ Created frontend\.env
)

echo.
echo 🚀 Setup complete!
echo.
echo Next steps:
echo 1. Open backend\.env and set DEPLOYER_PRIVATE_KEY
echo 2. Run: npm run hardhat:node (in contracts folder)
echo 3. Run: npm run deploy (in contracts folder)
echo 4. Run: npm run dev (in backend folder)
echo 5. Run: npm start (in frontend folder)
echo.
echo 📚 For more details, see docs/SETUP.md
