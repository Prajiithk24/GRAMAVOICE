$root = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($name in '.frontend.pid', '.backend.pid') {
  $pidFile = Join-Path $root $name
  if (-not (Test-Path $pidFile)) {
    continue
  }

  $pidValue = Get-Content -Raw $pidFile
  if ($pidValue) {
    $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
    if ($process) {
      Stop-Process -Id $pidValue -Force
    }
  }
  Remove-Item $pidFile -Force
}

foreach ($port in 5173, 8080) {
  $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) {
    Stop-Process -Id $listener.OwningProcess -Force
  }
}

Write-Host 'முன்பக்கம் மற்றும் பின்னணி சேவைகள் நிறுத்தப்பட்டன.'
