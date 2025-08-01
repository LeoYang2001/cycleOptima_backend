@echo off
echo 🚂 Railway Deployment Script for CycleOptima Backend
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Railway CLI
        echo Please install manually: npm install -g @railway/cli
        pause
        exit /b 1
    )
)

echo ✅ Railway CLI found

REM Check if logged in
railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Railway...
    railway login
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Login failed
        pause
        exit /b 1
    )
)

echo ✅ Logged in to Railway

REM Initialize project if not already done
if not exist "railway.json" (
    echo 🆕 Initializing Railway project...
    railway init
) else (
    echo ✅ Railway project already initialized
)

echo 🚀 Deploying to Railway...
railway up

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🌐 Getting your public URL...
    railway status
    echo.
    echo 📖 To view logs: railway logs
    echo 🌍 To open in browser: railway open
    echo ⚙️  To set environment variables: railway variables set KEY=value
) else (
    echo ❌ Deployment failed
)

echo.
pause
