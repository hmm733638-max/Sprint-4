# Arquitectura de SAHUR Sprint 4

## 1. Objetivo

Mantener una base común en la que frontend y backend puedan crecer sin saltarse capas ni mezclar responsabilidades.

## 2. Frontend — MVVM estricto

### Domain

Contiene modelos de dominio del frontend, interfaces de repositorio y Use Cases. No conoce HTTP ni detalles de Angular destinados al transporte.

### Data

Contiene DataSources, DTO, mappers e implementaciones de repositorios. `HttpClient` queda encapsulado en DataSources HTTP; Views, ViewModels y Use Cases no conocen transporte.

### Presentation

Se organiza por feature. Cada feature debe separar `views`, `view-models` y componentes visuales cuando sean necesarios.

Flujo obligatorio:

```text
View → ViewModel → Use Case → Repository Interface → Repository Implementation → DataSource → HttpClient → Backend
```

## 3. Backend — CQRS estricto

### Sahur.Domain

Capa más independiente. Aquí van Entities, Value Objects, Enums, Domain Events, Exceptions y reglas de dominio cuando existan.

### Sahur.Application

Contiene Commands, Queries, Handlers, contratos de aplicación y DTO/read models internos. Depende de Domain, nunca de Infrastructure.

### Sahur.Infrastructure

Contiene EF Core, `SahurDbContext`, implementaciones de repositorio y cualquier detalle técnico de persistencia.

### Sahur.Api

Expone HTTP. Los Controllers traducen HTTP a Commands/Queries y delegan mediante `ISender`.

## 4. CQRS

Para lectura:

```text
Controller → Query → QueryHandler → Read Repository → EF Core InMemory
```

Para escritura:

```text
Controller → Command → CommandHandler → Write Repository → IUnitOfWork → EF Core InMemory
```

No se mezclan operaciones de lectura y escritura en el mismo mensaje.

## 5. Repositorios

Evitar contratos genéricos con muchas responsabilidades. Crear interfaces pequeñas según la necesidad de cada feature, por ejemplo:

```text
IProductReadRepository
IProductWriteRepository
IUserReadRepository
IUserWriteRepository
```

Los contratos pertenecen a la capa interna que los necesita; las implementaciones concretas pertenecen a Infrastructure.

## 6. Dependency Injection

Ningún handler o Use Case debe crear manualmente repositorios, DbContext o HttpClient. Las implementaciones se conectan en los composition roots:

- Angular: `app.config.ts`
- .NET: `DependencyInjection.cs` + `Program.cs`

## 7. Base de datos simulada

La base usa EF Core InMemory. El proveedor se puede sustituir en el futuro sin modificar Domain ni Application.

No usar listas estáticas globales dentro de Controllers o servicios de negocio para simular persistencia.

## 8. Pruebas arquitectónicas

`Sahur.ArchitectureTests` valida las direcciones principales de dependencia y debe mantenerse en verde.
