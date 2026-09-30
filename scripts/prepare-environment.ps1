$ErrorActionPreference = 'Stop'

function Test-Command([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WithWinget([string]$Id, [string]$Label) {
    if (-not (Test-Command 'winget')) {
        throw "No se encontró winget. Instala '$Label' manualmente y vuelve a ejecutar este script."
    }

    Write-Host "Instalando $Label..." -ForegroundColor Cyan
    winget install --id $Id --exact --accept-package-agreements --accept-source-agreements
}

Write-Host '=== SAHUR | Preparación de entorno ===' -ForegroundColor Cyan

if (-not (Test-Command 'git')) {
    Install-WithWinget 'Git.Git' 'Git'
}

if (-not (Test-Command 'node')) {
    Install-WithWinget 'OpenJS.NodeJS.LTS' 'Node.js LTS'
}

if (-not (Test-Command 'dotnet')) {
    Install-WithWinget 'Microsoft.DotNet.SDK.10' '.NET SDK 10'
}

if (-not (Test-Command 'code')) {
    Install-WithWinget 'Microsoft.VisualStudioCode' 'Visual Studio Code'
}

Write-Host "`nVersiones detectadas:" -ForegroundColor Green
git --version
node --version
npm --version
dotnet --version

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $repoRoot 'frontend\sahur-web'
$backend = Join-Path $repoRoot 'backend'

Write-Host "`nInstalando dependencias Angular con npm ci..." -ForegroundColor Cyan
Push-Location $frontend
npm ci
Pop-Location

Write-Host "`nRestaurando dependencias .NET..." -ForegroundColor Cyan
Push-Location $backend
dotnet restore Sahur.sln
Pop-Location

Write-Host "`nEntorno preparado. Ejecutando verificación completa..." -ForegroundColor Cyan
& (Join-Path $PSScriptRoot 'verify.ps1')
