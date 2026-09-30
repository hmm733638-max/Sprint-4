# SAHUR Sprint 4 — instalación y preparación en Windows 11

Este proyecto usa exactamente la base que ya está en `SP4`: Angular 22 en el frontend y .NET 10 en el backend. El backend escucha en `http://localhost:5000` y Angular en `http://localhost:4200`.

## Opción rápida

Abre PowerShell en la raíz del repositorio y ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\prepare-environment.ps1
```

El script comprueba Git, Node.js, npm, .NET SDK 10 y VS Code. Si falta alguno y tienes `winget`, intenta instalarlo. Después ejecuta `npm ci`, `dotnet restore`, el build del frontend, el build Release del backend y las pruebas.

No hace falta instalar Angular CLI globalmente: el proyecto ya declara `@angular/cli` como dependencia de desarrollo y `npm start`/`npm run build` usan la versión local.

## Versiones esperadas

- Git.
- Node.js 22.x recomendado, porque el CI del repositorio usa Node 22.
- npm incluido con Node.
- .NET SDK 10.x, porque todos los proyectos apuntan a `net10.0`.
- VS Code.

Para comprobarlas:

```powershell
git --version
node --version
npm --version
dotnet --version
code --version
```

## Ejecutar el proyecto

Después de preparar el entorno puedes abrir dos terminales manualmente o ejecutar:

```powershell
.\scripts\run-dev.ps1
```

Manual, terminal 1:

```powershell
cd backend
dotnet run --project Sahur.Api
```

Manual, terminal 2:

```powershell
cd frontend\sahur-web
npm start
```

Abre `http://localhost:4200`. El frontend consume `http://localhost:5000/api`.

## Verificar antes de subir

```powershell
.\scripts\verify.ps1
```

Debe completar:

1. `npm run build`.
2. `dotnet build Sahur.sln --configuration Release`.
3. `dotnet test Sahur.sln --no-build --configuration Release`.

El tercer paso incluye `Sahur.ArchitectureTests`, que protege las dependencias entre Domain, Application, Infrastructure y Api.

## Subir a SP4

Primero revisa siempre:

```powershell
git status
git diff
```

Cuando estés conforme puedes usar:

```powershell
.\scripts\push-to-sp4.ps1
```

El script crea un commit, hace `git fetch origin SP4`, comprueba que la rama remota no haya avanzado desde la base y solo entonces ejecuta `git push origin HEAD:SP4`. Si detecta cambios nuevos en `SP4`, se detiene para no pisar el trabajo de tus compañeros.
