# PowerShell script to check application status
Write-Host "🔍 Checking Chat with PDF Application Status..." -ForegroundColor Cyan
Write-Host ""

# Check Docker services
Write-Host "📦 Docker Services:" -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# Check if ports are listening
Write-Host "🌐 Port Status:" -ForegroundColor Yellow
$ports = @(3000, 8000, 6333, 6379)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connection) {
        Write-Host "   ✅ Port $port is open" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Port $port is closed" -ForegroundColor Red
    }
}
Write-Host ""

# Check API endpoints
Write-Host "🔗 API Endpoints:" -ForegroundColor Yellow
try {
    $serverResponse = Invoke-WebRequest -Uri "http://localhost:8000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Server API (port 8000): $($serverResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server API (port 8000): Not responding" -ForegroundColor Red
}

try {
    $clientResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Client App (port 3000): $($clientResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Client App (port 3000): Not responding" -ForegroundColor Red
}
Write-Host ""

# Check environment file
Write-Host "🔧 Configuration:" -ForegroundColor Yellow
if (Test-Path "server\env.local") {
    $envContent = Get-Content "server\env.local"
    $apiKeyLine = $envContent | Where-Object { $_ -match "OPENAI_API_KEY=" }
    if ($apiKeyLine -and $apiKeyLine -ne "OPENAI_API_KEY=") {
        Write-Host "   ✅ OpenAI API key is configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  OpenAI API key is not set" -ForegroundColor Yellow
        Write-Host "      Run: .\setup-api-key.ps1 -ApiKey 'your-api-key-here'" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Environment file not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. If API key is not set, configure it with the setup script"
Write-Host "   2. Open http://localhost:3000 in your browser"
Write-Host "   3. Upload a PDF file and start chatting!"
Write-Host ""
