$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "[1/3] Frontend dependencies" -ForegroundColor Cyan
Push-Location "$Root/frontend/sahur-web"
npm ci

Write-Host "[2/3] Angular build" -ForegroundColor Cyan
npm run build
Pop-Location

Write-Host "[3/3] .NET build + architecture tests" -ForegroundColor Cyan
Push-Location "$Root/backend"
dotnet restore Sahur.sln
dotnet build Sahur.sln --no-restore --configuration Release
dotnet test Sahur.sln --no-build --configuration Release
Pop-Location

Write-Host "SAHUR base verificada correctamente." -ForegroundColor Green
