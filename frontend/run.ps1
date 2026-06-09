# GramaVoice Frontend - Run Script
# Usage: Open a terminal in the frontend/ folder and run: .\run.ps1

$frontendDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  GramaVoice Frontend" -ForegroundColor Cyan
Write-Host "  http://localhost:5180" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Install node_modules if missing
if (-Not (Test-Path "$frontendDir\node_modules")) {
    Write-Host "`nInstalling npm dependencies..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    Pop-Location
}

Write-Host "`nStarting frontend on port 5180...`n" -ForegroundColor Yellow
Write-Host "Make sure backend is running on http://localhost:8085 first!" -ForegroundColor DarkYellow
Write-Host ""

Push-Location $frontendDir
npm run dev
Pop-Location
