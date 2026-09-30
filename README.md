# SAHUR — Sprint 4

Solución base Full Stack con Angular + ASP.NET Core.

## Arquitectura obligatoria

- Frontend: MVVM estricto + SOLID + Dependency Injection.
- Backend: CQRS estricto + SOLID + Clean Architecture + Dependency Injection.
- Persistencia simulada: Entity Framework Core InMemory.
- API externa: Fake Store API, consumida únicamente desde Infrastructure.

## Reglas

1. Las Views de Angular solo se comunican con su ViewModel.
2. Los ViewModels no usan HttpClient directamente.
3. Los Use Cases dependen de abstracciones, nunca de implementaciones concretas.
4. Los Controllers .NET solo traducen HTTP a Commands/Queries y usan ISender.
5. Commands y Queries están separados y tienen handlers independientes.
6. Queries no modifican estado.
7. Commands no se utilizan para presentar modelos de lectura.
8. Domain no depende de API, Infrastructure, EF Core ni MediatR.
9. Application no depende de Infrastructure ni API.
10. Infrastructure implementa contratos definidos por capas internas.

## Flujo de lectura

Angular View -> ViewModel -> Use Case -> Repository abstraction -> HTTP repository -> Sahur.Api -> Query -> QueryHandler -> Read repository -> Fake Store API

## Flujo de escritura

HTTP -> Controller -> Command -> CommandHandler -> Write repository -> EF Core InMemory

## Ejecutar

Frontend:

```bash
cd frontend/sahur-web
npm install
npm start
```

Backend:

```bash
cd backend
dotnet restore
dotnet run --project Sahur.Api
```

Pruebas arquitectónicas:

```bash
cd backend
dotnet test
```

## US03-US05

La implementación de catálogo, filtros y detalle está documentada en `IMPLEMENTACION_US03_US05.md`.

Para preparar Windows automáticamente, consulta `SETUP_WINDOWS.md` o ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\prepare-environment.ps1
```
