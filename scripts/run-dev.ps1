$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $repoRoot 'frontend\sahur-web'
$backend = Join-Path $repoRoot 'backend'

Write-Host 'Iniciando backend en http://localhost:5000 ...' -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$backend'; dotnet run --project Sahur.Api"

Start-Sleep -Seconds 2

Write-Host 'Iniciando frontend en http://localhost:4200 ...' -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$frontend'; npm start"

Write-Host 'Se abrieron dos terminales. Backend: 5000 | Frontend: 4200' -ForegroundColor Green
