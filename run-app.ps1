$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mysqlService = Get-Service -Name 'MySQL80' -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -ne 'Running') {
  try {
    Start-Service -Name 'MySQL80'
  } catch {
    Write-Host 'MySQL80 சேவையை தானாக தொடங்க முடியவில்லை. அது நிறுத்தப்பட்டிருந்தால் கைமுறையாக தொடங்குங்கள்.'
  }
}

& (Join-Path $root 'run-backend.ps1')
Start-Sleep -Seconds 8
& (Join-Path $root 'run-frontend.ps1')

Write-Host 'இரண்டு பகுதிகளும் தொடங்கும் வரை சில விநாடிகள் காத்திருக்கவும்.'
Write-Host 'முன்பக்கம்: http://localhost:5173'
Write-Host 'பின்னணி: http://localhost:8080/api/dashboard/home'
