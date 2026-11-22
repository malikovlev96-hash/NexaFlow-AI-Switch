param([ValidateSet('start','stop','check')][string]$Action = 'start')
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Mobile = Join-Path $Root 'mobile'
$PidFile = Join-Path $env:LOCALAPPDATA 'NexaFlow\server.pid'
$LogDir = Join-Path $env:LOCALAPPDATA 'NexaFlow'
$LogFile = Join-Path $LogDir 'server.stdout.log'
$ErrorLog = Join-Path $LogDir 'server.stderr.log'
$Port = 8765
function Find-Python {
  $py = Get-Command py -ErrorAction SilentlyContinue
  if ($py) { try { $versionText = & $py.Source -3 --version 2>&1; if ($LASTEXITCODE -eq 0 -and "$versionText" -match 'Python 3\.') { return @{Exe=$py.Source; Prefix=@('-3'); Version="$versionText"} } } catch {} }
  $python = Get-Command python -ErrorAction SilentlyContinue
  if ($python) { try { $versionText = & $python.Source --version 2>&1; if ($LASTEXITCODE -eq 0 -and "$versionText" -match 'Python 3\.') { return @{Exe=$python.Source; Prefix=@(); Version="$versionText"} } } catch {} }
  return $null
}
function Get-Listener { Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 }
if (!(Test-Path $Mobile)) { throw "Не найдена папка mobile: $Mobile" }
if ($Action -eq 'check') {
  $py = Find-Python
  if (!$py) { Write-Host 'Python 3 не найден. Установите Python 3 с python.org и включите Add to PATH.' -ForegroundColor Yellow; exit 2 }
  Write-Host "Python доступен: $($py.Version)"
  if (Get-Listener) { Write-Host "Порт $Port занят." -ForegroundColor Yellow } else { Write-Host "Порт $Port свободен." -ForegroundColor Green }
  exit 0
}
if ($Action -eq 'stop') {
  if (!(Test-Path $PidFile)) { Write-Host 'NexaFlow не запущен (PID-файл отсутствует).'; exit 0 }
  $serverPid = [int](Get-Content $PidFile -Raw)
  $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $serverPid" -ErrorAction SilentlyContinue
  if ($proc -and $proc.CommandLine -match 'http\.server' -and $proc.CommandLine -match '8765' -and $proc.CommandLine -like "*$Root*") {
    Stop-Process -Id $serverPid -Force
    Write-Host 'Сервер NexaFlow остановлен.' -ForegroundColor Green
  } elseif ($proc) {
    Write-Host 'PID-файл устарел или PID принадлежит другому процессу. Чужой процесс не остановлен.' -ForegroundColor Yellow
  } else { Write-Host 'Процесс уже завершён.' }
  Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
  exit 0
}
$existing = Get-Listener
if ($existing) {
  try {
    $probe = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/mobile/" -TimeoutSec 2 -UseBasicParsing
    if ($probe.Content -match 'NEXAFLOW|NexaFlow') { Start-Process "http://127.0.0.1:$Port/mobile/"; Write-Host 'NexaFlow уже работает; открываю существующий сервер.'; exit 0 }
  } catch {}
  Write-Host "Порт $Port уже занят другим процессом (PID $($existing.OwningProcess)). Закройте приложение, использующее порт, или измените порт в desktop/launcher.ps1." -ForegroundColor Red
  exit 3
}
$py = Find-Python
if (!$py) { Write-Host 'Python 3 не найден. Установите Python 3 с python.org и включите Add to PATH.' -ForegroundColor Red; exit 2 }
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$serverArgs = @($py.Prefix) + @('-m','http.server',"$Port",'--bind','127.0.0.1','--directory',$Root)
$quotedArgs = ($serverArgs | ForEach-Object { '"' + ([string]$_).Replace('"','\"') + '"' }) -join ' '
$proc = Start-Process -FilePath $py.Exe -ArgumentList $quotedArgs -WorkingDirectory $Root -WindowStyle Hidden -PassThru -RedirectStandardOutput $LogFile -RedirectStandardError $ErrorLog
Set-Content -Path $PidFile -Value $proc.Id -NoNewline
$ready = $false
for ($i=0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 250
  try { $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/mobile/" -TimeoutSec 1 -UseBasicParsing; if ($r.StatusCode -eq 200 -and $r.Content -match 'NEXAFLOW|NexaFlow') { $ready=$true; break } } catch {}
  if ($proc.HasExited) { break }
}
if (!$ready) { if (!$proc.HasExited) { Stop-Process -Id $proc.Id -Force }; Remove-Item $PidFile -Force -ErrorAction SilentlyContinue; throw "Локальный сервер не прошёл health-check. Лог: $LogFile" }
Start-Process "http://127.0.0.1:$Port/mobile/"
Write-Host "NexaFlow запущен и проверен: http://127.0.0.1:$Port/mobile/" -ForegroundColor Green
Write-Host "Остановить: START-NEXAFLOW.cmd → пункт 2. Лог: $LogFile"
