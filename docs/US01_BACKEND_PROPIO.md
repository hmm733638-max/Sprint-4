# US01 con usuarios y backend propios

La US01 permite que un usuario inicie sesión en Angular con una cuenta definida en SAHUR, reciba un token y acceda a una pantalla inicial correspondiente a su rol. No consume proveedores externos.

## Revisión de la base

Se revisó SP4 en `0b32ce67a5111653febba1c1a2764711bfc774d7`, después del PR #4. Ese cambio reinició el árbol como base colaborativa: dejó el diagnóstico, las capas, MediatR, EF Core InMemory y las pruebas de arquitectura. Eliminó las implementaciones anteriores de autenticación y catálogo del árbol activo. Las ramas antiguas todavía representan el diseño anterior.

La base tenía `SahurDbContext`, pero no tenía entidades, DbSet, usuarios iniciales, login, autenticación ni sesión. El diagnóstico comprobaba la disponibilidad del proveedor; no demostraba que existieran usuarios o funcionalidades de negocio. El CI de ese commit concluyó correctamente en la ejecución 36777864204.

Se conservan la separación de proyectos, la paleta actual y el patrón MVVM de referencia. La rama de trabajo nace del SP4 refactorizado: `SP4-US01-AUTH-PROPIO`.

## Alcance y adaptación de la historia

La historia entregada todavía menciona una aplicación móvil, almacenamiento seguro nativo y credenciales de un proveedor externo. Se adapta a Angular y al backend propio según la nueva instrucción. El usuario eligió que el token se devuelva en la respuesta.

| Criterio | Comportamiento de esta implementación |
| --- | --- |
| Credenciales válidas | HTTP 200 con token, caducidad y usuario; sesión de pestaña y navegación al inicio. |
| Asignación de rol | IDs 1 y 2 Administrador; ID 3 Auditor; demás IDs positivos Cliente. La regla se aplica en Domain del backend. |
| Credenciales incorrectas | HTTP 401 y alerta roja con el texto `Usuario o contraseña inválidos`. |
| Sin conexión | El caso de uso consulta la conectividad antes del POST. Un fallo posterior de red o del servidor también se maneja. |
| Información del usuario | El login devuelve ID, username y role; `/api/auth/me` los vuelve a consultar para restaurar la sesión. |
| Interfaz por rol | Una pantalla inicial protegida con identificación y título específicos del rol. Los módulos de negocio se integrarán con sus propias US. |
| Persistencia del token | `sessionStorage`, separado mediante un contrato. Persiste al recargar la pestaña; no es almacenamiento seguro nativo ni HttpOnly y JavaScript puede acceder al token. |

No se implementa US02, registro público, CRUD de usuarios, productos, carrito ni auditoría. Los usuarios iniciales se configuran mediante un seeder centralizado. No se han establecido contraseñas ni cuentas de demostración para el usuario final.

El token es un valor opaco aleatorio de 256 bits, no un JWT. Su hash SHA-256 se guarda en una sesión de EF y el backend verifica existencia y caducidad en cada petición autenticada. No se necesita decodificarlo: la respuesta contiene el ID y el rol. Cambiar un ID o un rol en el navegador no cambia los permisos del backend.

La caducidad técnica actual es de una hora. No hay renovación automática ni cierre de sesión remoto en esta US. El despliegue fuera del entorno local requiere HTTPS y revisar almacenamiento del token y persistencia. Los futuros endpoints restringidos deben usar autorización del backend, por ejemplo `[Authorize(Roles = "Administrador")]`.

## Backend

| Operación | Endpoint | Mensaje y handler | Lecturas y escrituras |
| --- | --- | --- | --- |
| Login | POST `/api/auth/login` | `LoginCommand` y `LoginCommandHandler` | Lee usuario, verifica hash y guarda una sesión usando `IUnitOfWork`. |
| Autenticar petición | Cabecera `Authorization: Bearer <token>` | `AuthenticateSessionQuery` y su handler | Lee sesión y usuario. No guarda ni renueva nada. |
| Recuperar usuario actual | GET `/api/auth/me` | `GetCurrentUserQuery` y su handler | Lee al usuario de la identidad autenticada. No admite un ID elegido por el cliente. |

Request de login: propiedades `username` y `password`. Response: `accessToken`, `tokenType` igual a `Bearer`, `expiresAt` y `user` con `id`, `username`, `role`. Las credenciales ausentes producen 400; incorrectas, 401. Un token ausente, desconocido o caducado produce 401 en `/api/auth/me`. No se devuelven contraseñas ni hashes.

Flujo de login: Controller → ISender → LoginCommandHandler → IUserReadRepository e IPasswordHashService → IUserSessionWriteRepository → IUnitOfWork → EF Core InMemory. El handler coordina la sesión; la API se ocupa de HTTP.

Flujo de lectura: middleware de autenticación → Query de sesión → repositorios de lectura → identidad autenticada; Controller → Query de usuario → repositorio de lectura → modelo de respuesta.

Los contratos están en Application y las implementaciones en Infrastructure. Domain contiene User, UserSession y la política de roles sin depender de ASP.NET, EF o MediatR. Infrastructure utiliza PasswordHasher de ASP.NET Core Identity mediante el framework compartido instalado con .NET, sin implementar un algoritmo de contraseñas propio. Solo la capa técnica conoce este detalle.

El seeder es una operación de inicialización en Infrastructure. Valida IDs y nombres duplicados, genera hashes y llama a SaveChangesAsync. No constituye un endpoint ni una Query que escriba. La validación de duplicados es necesaria porque InMemory no impone los índices únicos de una base relacional.

## Frontend

Flujo: LoginView → LoginViewModel → LoginUseCase → AuthRepository → HttpAuthRepository → AuthDataSource → HttpAuthDataSource → API. El caso de uso verifica ConnectivityRepository y persiste el resultado mediante SessionRepository.

Restauración: guard → SessionViewModel → RestoreSessionUseCase → SessionRepository y AuthRepository → `/api/auth/me`. Solo se almacenan token y caducidad. El usuario y su rol se recuperan del servidor; una sesión caducada, corrupta o rechazada se elimina. Un fallo de red no elimina un token todavía válido.

Las Views delegan eventos y muestran señales. Los ViewModels administran estado, carga, errores y navegación. Los casos de uso dependen de contratos, siguiendo las convenciones de DI de la base. HttpClient está encapsulado en DataSources dentro de Data; DTO y entidades se separan mediante mappers. Los contratos de conectividad y almacenamiento permiten sustituir adaptadores sin cambiar Views ni casos de uso.

La comprobación `navigator.onLine` permite detectar el estado offline del navegador; no garantiza que el servidor sea accesible. Por eso se maneja también el fallo HTTP y se limita la espera a diez segundos.

## Configurar tus usuarios

Desde la raíz del repositorio, con .NET 10 y Python 3 disponibles:

```bash
python3 scripts/configure-users.py
```

El asistente solicita ID, nombre y contraseña sin mostrar la contraseña. Puedes repetirlo para agregar o actualizar usuarios. IDs 1 y 2 son administradores, 3 es auditor y 4 o superior es cliente. Esos roles son la regla explícita de la US, no una clasificación basada en los nombres de cuenta.

Los datos se guardan con `dotnet user-secrets` en el perfil local, fuera del repositorio, y se cargan en Development. User Secrets es una herramienta de desarrollo; no cifra las contraseñas en disco. Ninguna credencial se pasa en argumentos de comandos ni se imprime. Evita reutilizar una contraseña personal.

Reinicia la API después de configurar usuarios. Si no has configurado ninguno, el backend emite una advertencia y el login no acepta ninguna cuenta. Una configuración duplicada o incompleta impide el arranque y muestra el motivo sin imprimir contraseñas.

EF Core InMemory mantiene datos durante la ejecución del proceso. Al reiniciar, se pierden las sesiones y se recrean los usuarios desde la configuración. SaveChangesAsync no convierte este proveedor en almacenamiento duradero. Es el proveedor solicitado para el Sprint; al migrar a SQL se necesitarán configuración, esquema/migraciones y pruebas de restricciones del proveedor real.

## Ejecutar y verificar

Terminal de backend, desde la raíz:

```bash
dotnet run --project backend/Sahur.Api
```

Terminal de frontend, desde la raíz:

```bash
cd frontend/sahur-web
npm ci
npm start
```

Abre `http://localhost:4200`. La API escucha en `http://localhost:5000`. Se conserva la pantalla técnica en `/diagnostico`.

Verificación del backend, desde la raíz:

```bash
dotnet restore backend/Sahur.sln -m:1
dotnet build backend/Sahur.sln --no-restore --configuration Release -m:1
dotnet test backend/Sahur.sln --no-build --configuration Release -m:1
```

Verificación del frontend, desde su carpeta:

```bash
npm ci
npm run build
```

Las pruebas de Sahur.AuthTests usan la API completa con TestServer, el proveedor EF InMemory, repositorios reales y contraseñas aleatorias de prueba. Comprueban los cuatro IDs, acceso al usuario actual, credenciales incorrectas y ausentes, tokens desconocidos/caducados, hashes, seeding repetido y ausencia de escritura al leer. Sahur.ArchitectureTests conserva sus reglas y añade la prohibición de ASP.NET en Domain y Application.

Para comprobar Angular manualmente: inicia sesión con cada rol; recarga; prueba contraseña incorrecta; activa Offline en las herramientas del navegador con el formulario abierto y comprueba que no salga un POST; restablece la red; reinicia el backend y recarga para verificar que exige una sesión nueva.

## Integración

Los puntos compartidos modificados son DbContext, DI, Program.cs, rutas, la solución de .NET y las pruebas arquitectónicas. Otros integrantes deben crear sus ramas a partir de la base nueva e integrar esos puntos mediante cambios pequeños. No deben volver a copiar la autenticación antigua ni restaurar adaptadores externos.

La única dependencia de paquete añadida es Microsoft.AspNetCore.Mvc.Testing 10.0.12, utilizada por las pruebas HTTP. No se actualizan las versiones de Angular, TypeScript, EF, MediatR ni xUnit de la base.

El script `publish-base-pr.ps1` corresponde al reinicio completo de la base: elimina el árbol y lo sustituye. Para integrar esta US se usa una rama y un PR normal hacia SP4. Los scripts PowerShell existentes tampoco verifican todos los códigos de salida nativos; conviene comprobar los resultados de build/test directamente. Su mejora queda fuera de US01.

Referencias técnicas: [EF Core InMemory](https://learn.microsoft.com/en-us/ef/core/providers/in-memory/), [User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-10.0).

## Archivos creados

Rutas completas relativas a la raíz de Sprint-4.

### Domain backend

- `backend/Sahur.Domain/Auth/UserSession.cs`
- `backend/Sahur.Domain/Users/User.cs`
- `backend/Sahur.Domain/Users/UserRole.cs`

### Application backend

- `backend/Sahur.Application/Abstractions/IAccessTokenService.cs`
- `backend/Sahur.Application/Abstractions/IPasswordHashService.cs`
- `backend/Sahur.Application/Abstractions/IUserReadRepository.cs`
- `backend/Sahur.Application/Abstractions/IUserSessionReadRepository.cs`
- `backend/Sahur.Application/Abstractions/IUserSessionWriteRepository.cs`
- `backend/Sahur.Application/Auth/AuthenticatedUserReadModel.cs`
- `backend/Sahur.Application/Auth/Commands/Login/LoginCommand.cs`
- `backend/Sahur.Application/Auth/Commands/Login/LoginCommandHandler.cs`
- `backend/Sahur.Application/Auth/Queries/AuthenticateSession/AuthenticateSessionQuery.cs`
- `backend/Sahur.Application/Auth/Queries/AuthenticateSession/AuthenticateSessionQueryHandler.cs`
- `backend/Sahur.Application/Auth/Queries/GetCurrentUser/GetCurrentUserQuery.cs`
- `backend/Sahur.Application/Auth/Queries/GetCurrentUser/GetCurrentUserQueryHandler.cs`

### Infrastructure backend

- `backend/Sahur.Infrastructure/Auth/EfUserSessionReadRepository.cs`
- `backend/Sahur.Infrastructure/Auth/EfUserSessionWriteRepository.cs`
- `backend/Sahur.Infrastructure/Auth/IdentityPasswordHashService.cs`
- `backend/Sahur.Infrastructure/Auth/RandomAccessTokenService.cs`
- `backend/Sahur.Infrastructure/Persistence/Configurations/UserConfiguration.cs`
- `backend/Sahur.Infrastructure/Persistence/Configurations/UserSessionConfiguration.cs`
- `backend/Sahur.Infrastructure/Persistence/SahurDatabaseSeeder.cs`
- `backend/Sahur.Infrastructure/Persistence/SeedUserOptions.cs`
- `backend/Sahur.Infrastructure/Users/EfUserReadRepository.cs`

### API

- `backend/Sahur.Api/Authentication/SahurBearerHandler.cs`
- `backend/Sahur.Api/Contracts/LoginRequest.cs`
- `backend/Sahur.Api/Controllers/AuthController.cs`

### Pruebas HTTP

- `backend/Sahur.AuthTests/AuthApiTests.cs`
- `backend/Sahur.AuthTests/Sahur.AuthTests.csproj`

### Domain frontend

- `frontend/sahur-web/src/app/domain/entities/auth.entity.ts`
- `frontend/sahur-web/src/app/domain/errors/auth.error.ts`
- `frontend/sahur-web/src/app/domain/repositories/auth.repository.ts`
- `frontend/sahur-web/src/app/domain/repositories/connectivity.repository.ts`
- `frontend/sahur-web/src/app/domain/repositories/session.repository.ts`
- `frontend/sahur-web/src/app/domain/use-cases/auth/login.use-case.ts`
- `frontend/sahur-web/src/app/domain/use-cases/auth/restore-session.use-case.ts`

### Data frontend

- `frontend/sahur-web/src/app/data/datasources/auth.datasource.ts`
- `frontend/sahur-web/src/app/data/datasources/http-auth.datasource.ts`
- `frontend/sahur-web/src/app/data/dto/auth.dto.ts`
- `frontend/sahur-web/src/app/data/mappers/auth.mapper.ts`
- `frontend/sahur-web/src/app/data/repositories/browser-connectivity.repository.ts`
- `frontend/sahur-web/src/app/data/repositories/browser-session.repository.ts`
- `frontend/sahur-web/src/app/data/repositories/http-auth.repository.ts`

### Presentation frontend

- `frontend/sahur-web/src/app/presentation/auth/auth-error-message.ts`
- `frontend/sahur-web/src/app/presentation/auth/guards/authenticated.guard.ts`
- `frontend/sahur-web/src/app/presentation/auth/view-models/login.viewmodel.ts`
- `frontend/sahur-web/src/app/presentation/auth/view-models/main.viewmodel.ts`
- `frontend/sahur-web/src/app/presentation/auth/view-models/session.viewmodel.ts`
- `frontend/sahur-web/src/app/presentation/auth/views/login.view.ts`
- `frontend/sahur-web/src/app/presentation/auth/views/main.view.ts`

### Configuración local

- `scripts/configure-users.py`

### Documentación

- `docs/US01_BACKEND_PROPIO.md`

## Archivos modificados

| Archivo | Responsabilidad del cambio |
| --- | --- |
| `README.md` | Acceso a la guía y puesta en marcha de US01. |
| `backend/Sahur.Api/Program.cs` | Autenticación, autorización, opciones e inicialización de usuarios. |
| `backend/Sahur.Api/Sahur.Api.csproj` | Identificador de User Secrets para configuración local. |
| `backend/Sahur.ArchitectureTests/ArchitectureRulesTests.cs` | Impide ASP.NET en Domain y Application. |
| `backend/Sahur.Infrastructure/DependencyInjection.cs` | Registra repositorios, servicios técnicos, reloj y seeder. |
| `backend/Sahur.Infrastructure/Persistence/SahurDbContext.cs` | Agrega DbSet de usuarios y sesiones. |
| `backend/Sahur.Infrastructure/Sahur.Infrastructure.csproj` | Acceso al PasswordHasher del framework compartido y eliminación de la referencia DI redundante. |
| `backend/Sahur.sln` | Incluye las pruebas HTTP de autenticación. |
| `frontend/sahur-web/src/app/app.config.ts` | Conecta contratos y adaptadores de autenticación, sesión y conectividad. |
| `frontend/sahur-web/src/app/app.routes.ts` | Login, inicio protegido y conservación del diagnóstico. |

## Resultado de la verificación local

- `npm ci` y `npm run build`: correctos con Node 24.19.0.
- Restore y build Release de .NET 10.0.401: correctos, sin advertencias ni errores, con `-m:1`.
- `Sahur.ArchitectureTests`: 13 pruebas aprobadas.
- `Sahur.AuthTests`: 14 pruebas aprobadas.
- Chromium contra el bundle Angular y la API reales: redirección de acceso anónimo, mensaje 401, desconexión sin POST, los cuatro usuarios y sus roles, restauración al recargar, intento de alterar el rol local, token falsificado, servidor inaccesible, ausencia de desbordamiento a 320 px y ausencia de excepciones JavaScript: correctos.
- Revisión visual del formulario en escritorio y móvil: correcta.
- `git diff --check`: correcto.

Este entorno requirió `-m:1`; el intento de compilación paralela terminó con código 1 sin aportar un diagnóstico de error. No se alteró la configuración compartida de CI para ocultarlo. Las pruebas y el build secuencial sí finalizaron correctamente. No existe todavía una ejecución de CI para estos cambios: la publicación necesita aprobación del usuario. El CI aprobado citado al inicio pertenece exclusivamente a la base `0b32ce6`.

La comprobación de navegador se realizó con cuentas y contraseñas efímeras de prueba, fuera del repositorio. No se entregan como cuentas del usuario. Los escenarios de navegador están documentados para reproducirlos manualmente; no se añadió un runner E2E al proyecto.

## Observaciones fuera de US01

Los ejemplos de verificación de README y COLLABORATION usan `cd ../../../backend` después de ubicarse en `frontend/sahur-web`; esa ruta sale de Sprint-4. La ruta relativa correcta desde esa carpeta es `../../backend`. Los comandos de esta guía parten explícitamente de la raíz para evitar esa ambigüedad. También se mantienen pendientes las mejoras de manejo de errores de los scripts PowerShell descritas en Integración.
