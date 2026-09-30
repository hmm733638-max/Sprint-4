$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $repoRoot 'frontend\sahur-web'
$backend = Join-Path $repoRoot 'backend'

Write-Host '=== Frontend: build Angular ===' -ForegroundColor Cyan
Push-Location $frontend
npm run build
Pop-Location

Write-Host "`n=== Backend: build Release ===" -ForegroundColor Cyan
Push-Location $backend
dotnet build Sahur.sln --configuration Release

Write-Host "`n=== Backend: tests + pruebas arquitectónicas ===" -ForegroundColor Cyan
dotnet test Sahur.sln --no-build --configuration Release
Pop-Location

Write-Host "`nTodo compiló y las pruebas terminaron correctamente." -ForegroundColor Green
