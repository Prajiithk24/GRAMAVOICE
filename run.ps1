# GramaVoice - Start Backend + Frontend
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  GramaVoice App Launcher" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# --- Kill old Java/Node processes on those ports ---
Write-Host "`n[1/3] Cleaning up old processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
$ports = @(8085, 5180)
foreach ($port in $ports) {
    $procId = (netstat -ano | Select-String ":$port\s" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)
    if ($procId -and $procId -match '^\d+$') {
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2

# --- Build backend JAR if not present ---
$jar = "$root\backend\target\backend-0.0.1-SNAPSHOT.jar"
if (-Not (Test-Path $jar)) {
    Write-Host "`n[2/3] Building backend JAR (first time only)..." -ForegroundColor Yellow
    Push-Location "$root\backend"
    & .\mvnw.cmd package -DskipTests
    Pop-Location
} else {
    Write-Host "`n[2/3] Backend JAR already built." -ForegroundColor Green
}

# --- Start Backend in new window ---
Write-Host "`n[3/3] Starting Backend on http://localhost:8085 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$root\backend'; " +
    "`$env:SERVER_PORT='8085'; " +
    "`$env:GRAMAVOICE_DB_URL='jdbc:h2:file:./data/gramavoice;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL'; " +
    "`$env:GRAMAVOICE_DB_USERNAME='sa'; " +
    "`$env:GRAMAVOICE_DB_PASSWORD=''; " +
    "`$env:APP_AUTH_SECRET='replace-with-a-long-random-secret'; " +
    "`$env:SARVAM_API_KEY='sk_rj6ttq4q_B6Bo503VcbvqGNC4qWaIyhUd'; " +
    "`$env:SARVAM_MODEL='sarvam-30b'; " +
    "`$env:SARVAM_ENABLED='true'; " +
    "java -jar target\backend-0.0.1-SNAPSHOT.jar"
)

# Wait a moment then start frontend
Start-Sleep -Seconds 3

# --- Start Frontend in new window ---
Write-Host "Starting Frontend on http://localhost:5180 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$root\frontend'; npm run dev"
)

Write-Host "`n✅ Both servers are starting!" -ForegroundColor Green
Write-Host "   Backend  → http://localhost:8085" -ForegroundColor Cyan
Write-Host "   Frontend → http://localhost:5180" -ForegroundColor Cyan
Write-Host "`nClose the opened windows to stop the servers." -ForegroundColor Gray
