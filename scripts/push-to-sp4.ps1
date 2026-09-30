$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host '=== Estado antes de subir ===' -ForegroundColor Cyan
git status
git diff --stat

$answer = Read-Host '¿Ya revisaste los cambios y quieres crear el commit? (s/n)'
if ($answer -notin @('s', 'S')) {
    Write-Host 'Operación cancelada. No se modificó Git.' -ForegroundColor Yellow
    exit 0
}

Write-Host "`nEjecutando build y pruebas antes del commit..." -ForegroundColor Cyan
& (Join-Path $PSScriptRoot 'verify.ps1')

git add -A
git commit -m 'feat: implement US03 US04 and US05 product catalog flow'

Write-Host "`nSincronizando la referencia remota de SP4..." -ForegroundColor Cyan
git fetch origin SP4

Write-Host "`nRevisando que SP4 no haya avanzado desde tu base..." -ForegroundColor Cyan
$base = git merge-base HEAD origin/SP4
$remote = git rev-parse origin/SP4
if ($base -ne $remote) {
    Write-Host 'SP4 tiene cambios nuevos. NO se hará push automático para evitar pisarlos.' -ForegroundColor Yellow
    Write-Host 'Ejecuta: git rebase origin/SP4  (resuelve conflictos si aparecen) y vuelve a correr este script.' -ForegroundColor Yellow
    exit 1
}

Write-Host "`nSubiendo este commit directamente a la rama SP4..." -ForegroundColor Cyan
git push origin HEAD:SP4
Write-Host 'Push terminado.' -ForegroundColor Green
