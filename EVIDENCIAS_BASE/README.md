# Evidencias de la solución base

Esta carpeta documenta qué debe comprobarse antes de aceptar cambios en la base.

## Arquitectura

- Angular separado en `domain`, `data` y `presentation`.
- View → ViewModel → Use Case → Repository.
- Backend separado en Domain, Application, Infrastructure y Api.
- Controllers usan MediatR.
- Queries y Commands se mantienen separados.
- EF Core InMemory está configurado únicamente en Infrastructure.
- No existen integraciones con APIs externas; la persistencia de desarrollo es local e InMemory.

## Comandos de evidencia

Frontend:

```bash
cd frontend/sahur-web
npm install
npm run build
```

Backend:

```bash
cd backend
dotnet restore Sahur.sln
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
```

Búsqueda de integraciones HTTP externas: revisa que `Infrastructure` no registre clientes HTTP hacia proveedores de terceros.

## Publicación

La entrega incluye `scripts/publish-base-pr.ps1` para crear una rama desde la versión más reciente de `SP4`, sustituir el árbol por esta base y abrir un Pull Request cuando GitHub CLI esté autenticado.
