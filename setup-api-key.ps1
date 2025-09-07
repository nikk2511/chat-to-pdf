# PowerShell script to set up OpenAI API key
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

$envFile = "server\env.local"
$content = Get-Content $envFile
$newContent = $content -replace "OPENAI_API_KEY=", "OPENAI_API_KEY=$ApiKey"
$newContent | Set-Content $envFile

Write-Host "✅ OpenAI API key has been set in $envFile"
Write-Host "🔄 Please restart the server for changes to take effect"
Write-Host "   You can restart by stopping the current server (Ctrl+C) and running: npm run dev"
