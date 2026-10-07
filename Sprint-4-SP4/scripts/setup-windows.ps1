$ErrorActionPreference = "Stop"

function Ensure-WingetPackage($Id, $Name) {
  $found = winget list --id $Id --exact 2>$null | Select-String $Id
  if (-not $found) {
    Write-Host "Instalando $Name..." -ForegroundColor Cyan
    winget install --id $Id --exact --accept-package-agreements --accept-source-agreements
  } else {
    Write-Host "$Name ya está instalado." -ForegroundColor Green
  }
}

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  throw "winget no está disponible. Instala App Installer desde Microsoft Store y vuelve a ejecutar este script."
}

Ensure-WingetPackage "Git.Git" "Git"
Ensure-WingetPackage "OpenJS.NodeJS.LTS" "Node.js LTS"
Ensure-WingetPackage "Microsoft.DotNet.SDK.10" ".NET 10 SDK"
Ensure-WingetPackage "Microsoft.VisualStudioCode" "Visual Studio Code"
Ensure-WingetPackage "GitHub.cli" "GitHub CLI"

Write-Host "Reabre PowerShell después de una instalación nueva y ejecuta scripts/verify.ps1." -ForegroundColor Yellow
