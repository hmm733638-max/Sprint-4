$Root = Split-Path -Parent $PSScriptRoot

Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location '$Root/backend'; dotnet run --project Sahur.Api"
)

Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location '$Root/frontend/sahur-web'; npm start"
)

Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Green
