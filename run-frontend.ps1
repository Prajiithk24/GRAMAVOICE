param(
  [string]$ApiUrl = 'http://localhost:8080',
  [int]$Port = 5173
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $root 'frontend'
$pidFile = Join-Path $root '.frontend.pid'
$logFile = Join-Path $frontendDir 'frontend.log'
$errorFile = Join-Path $frontendDir 'frontend-error.log'

if (Test-Path $pidFile) {
  $existingPid = Get-Content -Raw $pidFile
  if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
    Write-Host "முன்பக்கம் ஏற்கனவே இயங்குகிறது: http://localhost:$Port"
    exit 0
  }
  Remove-Item $pidFile -Force
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Host "முன்பக்கத்திற்கு $Port ஏற்கனவே பயன்படுத்தப்படுகிறது."
  exit 0
}

if (-not (Test-Path (Join-Path $frontendDir 'node_modules'))) {
  Push-Location $frontendDir
  try {
    if (Test-Path (Join-Path $frontendDir 'package-lock.json')) {
      npm.cmd ci
    } else {
      npm.cmd install
    }
    if ($LASTEXITCODE -ne 0) {
      throw 'Frontend dependencies install failed.'
    }
  } finally {
    Pop-Location
  }
}

$safeApiUrl = $ApiUrl.Replace("'", "''")
$command = @"
`$env:VITE_PROXY_TARGET = '$safeApiUrl'
npm.cmd run dev -- --host 0.0.0.0 --port $Port
"@
$powerShellPath = Join-Path $PSHOME 'powershell.exe'

$process = Start-Process -FilePath $powerShellPath `
  -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', $command `
  -WorkingDirectory $frontendDir `
  -WindowStyle Hidden `
  -RedirectStandardOutput $logFile `
  -RedirectStandardError $errorFile `
  -PassThru

$trackedPid = $process.Id
for ($attempt = 0; $attempt -lt 15; $attempt++) {
  Start-Sleep -Seconds 1
  $activeListener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($activeListener) {
    $trackedPid = $activeListener.OwningProcess
    break
  }
  $process.Refresh()
  if ($process.HasExited) {
    break
  }
}

Set-Content -Path $pidFile -Value $trackedPid
Write-Host "முன்பக்கம் தொடங்கப்பட்டது: http://localhost:$Port"
