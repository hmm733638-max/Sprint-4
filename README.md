# SAHUR — Sprint 4 Base

Solución base colaborativa Full Stack para Sprint 4.

Esta versión **no consume APIs externas**. La aplicación está preparada para que cada integrante implemente sus User Stories sobre una arquitectura común, usando una persistencia simulada con **Entity Framework Core InMemory**.

## Stack

- Frontend: Angular 22 + TypeScript
- Node.js: 24 LTS
- GitHub CLI: opcional para crear el Pull Request desde terminal
- Backend: ASP.NET Core / .NET 10
- Persistencia de desarrollo: Entity Framework Core InMemory
- Comunicación: REST HTTP/JSON
- Control de versiones: Git + GitHub

## Arquitectura obligatoria

### Frontend

MVVM estricto:

```text
View
↓
ViewModel
↓
Use Case
↓
Repository Interface
↓
Repository Implementation
↓
DataSource
↓
HttpClient
↓
Backend .NET
```

Reglas:

- La View no contiene lógica de negocio.
- La View solo interactúa con su ViewModel.
- El ViewModel administra estado, loading y errores.
- El ViewModel no usa HttpClient.
- Los Use Cases dependen de abstracciones.
- HttpClient solo se usa en `data/`.
- Los DTO de transporte no llegan directamente a la View.

### Backend

CQRS estricto + Clean Architecture:

```text
Controller
↓
Command / Query
↓
MediatR
↓
Handler
↓
Repository abstraction
↓
Infrastructure
↓
EF Core InMemory
```

Reglas:

- Queries: solo lectura, nunca modifican estado.
- Commands: crean, modifican o eliminan estado.
- Cada Command/Query tiene su Handler.
- Controllers delgados: no contienen lógica de negocio ni DbContext.
- Domain no depende de Application, Infrastructure, Api, EF Core o MediatR.
- Application no depende de Infrastructure ni Api.
- Infrastructure implementa contratos de capas internas.
- No se utiliza un `IRepository` genérico gigante. Los contratos se crean por responsabilidad y feature.

## Estructura

```text
Sprint-4/
├── frontend/
│   └── sahur-web/
│       └── src/app/
│           ├── domain/
│           ├── data/
│           └── presentation/
├── backend/
│   ├── Sahur.Api/
│   ├── Sahur.Application/
│   ├── Sahur.Domain/
│   ├── Sahur.Infrastructure/
│   └── Sahur.ArchitectureTests/
├── docs/
└── EVIDENCIAS_BASE/
```

## Persistencia simulada

`Sahur.Infrastructure` registra `SahurDbContext` con:

```csharp
options.UseInMemoryDatabase("SahurDb");
```

Cada equipo debe agregar sus `DbSet`, configuraciones y repositorios en Infrastructure. La persistencia se trata como una base real: repositorios, `SaveChangesAsync`, DI y separación de responsabilidades.

## Diagnóstico base

La solución conserva una funcionalidad técnica de diagnóstico para comprobar el flujo completo de la arquitectura:

```text
Angular Home View
→ HomeViewModel
→ GetSystemStatusUseCase
→ SystemStatusRepository
→ HttpSystemStatusRepository
→ HttpSystemStatusDataSource / HttpClient
→ GET /api/system/status
→ SystemController
→ GetSystemStatusQuery
→ GetSystemStatusQueryHandler
→ ISystemStatusReadRepository
→ InMemorySystemStatusReadRepository
→ SahurDbContext / EF Core InMemory
```

No es una User Story de negocio. Sirve como referencia mínima para que los colaboradores implementen sus features sin inventar acoplamientos.

## US01 con backend propio

Esta rama implementa login con usuarios configurados por el equipo, contraseñas con hash y sesiones en EF Core InMemory. `POST /api/auth/login` devuelve un token Bearer; `GET /api/auth/me` recupera al usuario autenticado. Angular conserva el token durante la pestaña mediante una abstracción de sessionStorage.

Antes de arrancar, configura tus usuarios desde la raíz con `python3 scripts/configure-users.py`. Los IDs 1 y 2 son Administrador, 3 es Auditor y los demás son Cliente. No hay cuentas ni contraseñas predeterminadas. Al reiniciar el backend se recrean los usuarios configurados y se invalidan las sesiones anteriores.

Consulta [la revisión, arquitectura y guía de US01](docs/US01_BACKEND_PROPIO.md) para ver el alcance, los archivos y las comprobaciones.

## Ejecutar

### Frontend

```bash
cd frontend/sahur-web
npm install
npm start
```

Angular: `http://localhost:4200`

### Backend

```bash
cd backend
dotnet restore Sahur.sln
dotnet run --project Sahur.Api
```

API: `http://localhost:5000`

## Verificar

```bash
cd frontend/sahur-web
npm run build

cd ../../../backend
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
```

Revisa `docs/ARCHITECTURE.md` y `docs/COLLABORATION.md` antes de implementar una User Story.

## Preparación rápida en Windows

El repositorio incluye:

```text
scripts/setup-windows.ps1
scripts/verify.ps1
scripts/run-dev.ps1
```

En PowerShell desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-windows.ps1
.\scripts\verify.ps1
.\scripts\run-dev.ps1
```
