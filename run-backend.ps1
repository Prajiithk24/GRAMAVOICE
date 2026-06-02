param(
  [string]$DbUrl = $env:GRAMAVOICE_DB_URL,
  [string]$DbUsername = $env:GRAMAVOICE_DB_USERNAME,
  [string]$DbPassword = $env:GRAMAVOICE_DB_PASSWORD,
  [string]$SarvamApiKey = $env:SARVAM_API_KEY,
  [string]$SarvamModel = $env:SARVAM_MODEL,
  [string]$SarvamEnabled = $env:SARVAM_ENABLED,
  [int]$Port = 8080
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'backend'
$pidFile = Join-Path $root '.backend.pid'
$logFile = Join-Path $backendDir 'backend.log'
$errorFile = Join-Path $backendDir 'backend-error.log'
$jarPath = Join-Path $backendDir 'target\\backend-0.0.1-SNAPSHOT.jar'
$localEnvFile = Join-Path $root '.env.local'

if (Test-Path $localEnvFile) {
  Get-Content $localEnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
      $parts = $line.Split('=', 2)
      $name = $parts[0].Trim()
      $value = $parts[1].Trim()
      if ($name -and -not [Environment]::GetEnvironmentVariable($name, 'Process')) {
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
      }
    }
  }
  if ([string]::IsNullOrWhiteSpace($SarvamApiKey)) {
    $SarvamApiKey = $env:SARVAM_API_KEY
  }
  if ([string]::IsNullOrWhiteSpace($SarvamModel)) {
    $SarvamModel = $env:SARVAM_MODEL
  }
  if ([string]::IsNullOrWhiteSpace($SarvamEnabled)) {
    $SarvamEnabled = $env:SARVAM_ENABLED
  }
}

if ([string]::IsNullOrWhiteSpace($DbUrl)) {
  $DbUrl = 'jdbc:h2:file:./data/gramavoice;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL'
}
if ([string]::IsNullOrWhiteSpace($DbUsername)) {
  $DbUsername = 'sa'
}
if ([string]::IsNullOrWhiteSpace($DbPassword)) {
  $DbPassword = ''
}
if ([string]::IsNullOrWhiteSpace($SarvamModel)) {
  $SarvamModel = 'sarvam-30b'
}
if ([string]::IsNullOrWhiteSpace($SarvamEnabled)) {
  $SarvamEnabled = 'true'
}
if ($null -eq $SarvamApiKey) {
  $SarvamApiKey = ''
}

if (Test-Path $pidFile) {
  $existingPid = Get-Content -Raw $pidFile
  if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
    Write-Host "பின்னணி சேவை ஏற்கனவே இயங்குகிறது: http://localhost:$Port/api/dashboard/home"
    exit 0
  }
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Host "பின்னணி சேவைக்கு $Port ஏற்கனவே பயன்படுத்தப்படுகிறது."
  exit 0
}

Push-Location $backendDir
try {
  & .\mvnw.cmd -q -DskipTests package
  if ($LASTEXITCODE -ne 0) {
    $mavenCommand = Get-Command mvn.cmd -ErrorAction SilentlyContinue
    if (-not $mavenCommand) {
      exit $LASTEXITCODE
    }
    & $mavenCommand.Source -q -DskipTests package
    if ($LASTEXITCODE -ne 0) {
      exit $LASTEXITCODE
    }
  }
} finally {
  Pop-Location
}

$javaPath = $null
if ($env:JAVA_HOME) {
  $javaFromHome = Join-Path $env:JAVA_HOME 'bin\\java.exe'
  if (Test-Path $javaFromHome) {
    $javaPath = $javaFromHome
  }
}
if (-not $javaPath) {
  $javaCommand = Get-Command java -ErrorAction SilentlyContinue
  if ($javaCommand) {
    $javaPath = $javaCommand.Source
  }
}
if (-not $javaPath) {
  $javaPath = Get-ChildItem 'C:\\Program Files\\Eclipse Adoptium' -Recurse -Filter java.exe -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $javaPath) {
  $javaPath = Get-ChildItem 'C:\\Program Files\\Java' -Recurse -Filter java.exe -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $javaPath) {
  throw 'Java executable கிடைக்கவில்லை.'
}

$safeJavaPath = $javaPath.Replace("'", "''")
$safeDbUrl = $DbUrl.Replace("'", "''")
$safeDbUsername = $DbUsername.Replace("'", "''")
$safeDbPassword = $DbPassword.Replace("'", "''")
$safeSarvamApiKey = $SarvamApiKey.Replace("'", "''")
$safeSarvamModel = $SarvamModel.Replace("'", "''")
$safeSarvamEnabled = $SarvamEnabled.Replace("'", "''")
$command = @"
`$env:GRAMAVOICE_DB_URL = '$safeDbUrl'
`$env:GRAMAVOICE_DB_USERNAME = '$safeDbUsername'
`$env:GRAMAVOICE_DB_PASSWORD = '$safeDbPassword'
`$env:SARVAM_API_KEY = '$safeSarvamApiKey'
`$env:SARVAM_MODEL = '$safeSarvamModel'
`$env:SARVAM_ENABLED = '$safeSarvamEnabled'
& '$safeJavaPath' -jar '.\\target\\backend-0.0.1-SNAPSHOT.jar'
"@
$powerShellPath = Join-Path $PSHOME 'powershell.exe'

$process = Start-Process -FilePath $powerShellPath `
  -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', $command `
  -WorkingDirectory $backendDir `
  -WindowStyle Hidden `
  -RedirectStandardOutput $logFile `
  -RedirectStandardError $errorFile `
  -PassThru

$trackedPid = $process.Id
for ($attempt = 0; $attempt -lt 20; $attempt++) {
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
Write-Host "பின்னணி சேவை தொடங்கப்பட்டது: http://localhost:$Port/api/dashboard/home"
