param(
    [string]$Repository = "https://github.com/hmm733638-max/Sprint-4.git",
    [string]$BaseBranch = "SP4",
    [string]$WorkBranch = "setup/sp4-base-inmemory"
)

$ErrorActionPreference = "Stop"
$SourceRoot = Split-Path -Parent $PSScriptRoot
$TempRoot = Join-Path $env:TEMP "sahur-sp4-base-publish"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git no está instalado o no está disponible en PATH."
}

if (Test-Path $TempRoot) {
    Remove-Item $TempRoot -Recurse -Force
}

Write-Host "Clonando la rama $BaseBranch..." -ForegroundColor Cyan
git clone --branch $BaseBranch --single-branch $Repository $TempRoot

Push-Location $TempRoot
try {
    Write-Host "Creando rama $WorkBranch..." -ForegroundColor Cyan
    git switch -c $WorkBranch

    Write-Host "Eliminando el contenido anterior del árbol de trabajo..." -ForegroundColor Cyan
    git rm -r --ignore-unmatch . | Out-Null

    Write-Host "Copiando la solución base nueva..." -ForegroundColor Cyan
    $excludeDirs = @('.git', 'node_modules', 'dist', 'bin', 'obj', '.angular')
    $excludeArgs = @()
    foreach ($dir in $excludeDirs) {
        $excludeArgs += '/XD'
        $excludeArgs += (Join-Path $SourceRoot $dir)
    }

    $robocopyArgs = @(
        $SourceRoot,
        $TempRoot,
        '/E',
        '/NFL',
        '/NDL',
        '/NJH',
        '/NJS',
        '/NP'
    ) + $excludeArgs

    & robocopy @robocopyArgs | Out-Null
    if ($LASTEXITCODE -gt 7) {
        throw "Robocopy terminó con código $LASTEXITCODE."
    }

    git add -A

    Write-Host "`nCambios que se publicarán:" -ForegroundColor Yellow
    git status --short

    if (-not (git diff --cached --quiet)) {
        git commit -m "chore: reset SP4 to clean MVVM CQRS InMemory base"
    } else {
        throw "No se detectaron cambios para publicar."
    }

    git push -u origin $WorkBranch

    $repoSlug = $Repository -replace '^https://github.com/', '' -replace '\.git$', ''
    $compareUrl = "https://github.com/$repoSlug/compare/$BaseBranch...$WorkBranch?expand=1"

    if (Get-Command gh -ErrorAction SilentlyContinue) {
        $ghAuth = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Creando Pull Request..." -ForegroundColor Cyan
            gh pr create `
                --repo $repoSlug `
                --base $BaseBranch `
                --head $WorkBranch `
                --title "chore: restablecer SP4 como solución base InMemory" `
                --body "Reemplaza la implementación previa por una solución base colaborativa. Elimina integraciones externas y deja Angular con MVVM estricto, backend .NET con CQRS estricto, SOLID, Dependency Injection, Clean Architecture, EF Core InMemory y pruebas arquitectónicas."
            exit 0
        }
    }

    Write-Host "`nLa rama quedó subida. Abre este enlace para crear el Pull Request:" -ForegroundColor Green
    Write-Host $compareUrl -ForegroundColor Cyan
}
finally {
    Pop-Location
}
