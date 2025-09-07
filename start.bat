@echo off
echo 🚀 Starting Chat with PDF Application...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if config.env exists
if not exist "server\config.env" (
    echo ⚠️  config.env not found. Please create server\.env with your OpenAI API key
    echo    Copy server\config.env to server\.env and add your API key
    pause
    exit /b 1
)

REM Start services
echo 📦 Starting Docker services...
docker-compose up -d valkey qdrant

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Install dependencies if needed
if not exist "server\node_modules" (
    echo 📥 Installing server dependencies...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules" (
    echo 📥 Installing client dependencies...
    cd client
    call npm install
    cd ..
)

echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo    1. Start the server: cd server ^&^& npm run dev
echo    2. Start the worker: cd server ^&^& npm run dev:worker (in another terminal)
echo    3. Start the client: cd client ^&^& npm run dev
echo.
echo 🌐 Access the application at: http://localhost:3000
echo 🔧 API available at: http://localhost:8000
echo.
pause
