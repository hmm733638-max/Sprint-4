# Épica 3 — US06, US07 y US08

Implementación de gestión administrativa de productos sobre la arquitectura existente de SAHUR Sprint 4.

## Alcance

- **US06 — Agregar nuevo producto al catálogo**
  - Formulario exclusivo para Administrador.
  - Validación local de título, precio, descripción, URL de imagen y categoría.
  - La petición no se envía si existen errores locales.
  - `POST /api/products` devuelve `201 Created` y el producto con su ID generado.
  - Al crear correctamente se muestra confirmación con el ID y se limpia el formulario.
  - Cliente y Auditor son redirigidos al catálogo si intentan entrar por URL directa.
  - El backend también protege el endpoint por rol.

- **US07 — Editar información de un artículo**
  - Se reutiliza la base ya integrada de edición desde el detalle del producto.
  - El formulario se precarga con los datos actuales.
  - Se valida título, precio, descripción y categoría antes del `PUT`.
  - El botón se deshabilita mientras la operación está en curso.
  - Se muestra confirmación al terminar y el detalle se actualiza visualmente.
  - Cliente y Auditor no reciben interfaz de edición y el backend responde `403` ante un `PUT` forzado.

- **US08 — Eliminar producto del sistema**
  - El botón Eliminar solo se renderiza para Administrador.
  - Se requiere confirmación mediante un elemento nativo `dialog` antes de enviar `DELETE`.
  - Cancelar cierra la confirmación y no ejecuta ninguna petición.
  - Tras eliminar se muestra una notificación y se redirige al catálogo.
  - Cliente y Auditor quedan bloqueados en frontend y backend.

## Nota sobre Fake Store API

Los documentos originales de las User Stories contienen notas heredadas sobre Fake Store API. La solución base actual establece expresamente que SAHUR no utiliza APIs externas. Por ese motivo, esta implementación conserva la intención funcional de las historias pero utiliza exclusivamente:

`Angular -> Sahur.Api -> Application -> Domain/Repositories -> Infrastructure -> EF Core InMemory`

No se agregó ninguna dependencia de Fake Store API.

## Flujo US06

### Frontend

`ProductCreateView -> ProductCreateViewModel -> CreateProductUseCase -> ProductRepository -> HttpProductRepository -> ProductDataSource -> HttpClient`

### Backend

`POST /api/products -> ProductsController -> CreateProductCommand -> CreateProductCommandHandler -> IProductWriteRepository -> EfProductWriteRepository -> SahurDbContext -> SaveChangesAsync`

## Flujo US07

### Frontend

`ProductDetailView -> ProductDetailViewModel -> UpdateProductUseCase -> ProductRepository -> HttpProductRepository -> ProductDataSource -> HttpClient`

### Backend

`PUT /api/products/{id} -> ProductsController -> UpdateProductCommand -> UpdateProductCommandHandler -> IProductWriteRepository -> EfProductWriteRepository -> SahurDbContext -> SaveChangesAsync`

## Flujo US08

### Frontend

`ProductDetailView -> ProductDetailViewModel -> DeleteProductUseCase -> ProductRepository -> HttpProductRepository -> ProductDataSource -> HttpClient`

### Backend

`DELETE /api/products/{id} -> ProductsController -> DeleteProductCommand -> DeleteProductCommandHandler -> IProductWriteRepository -> EfProductWriteRepository -> SahurDbContext -> SaveChangesAsync`

## Verificación recomendada

Desde `frontend/sahur-web`:

```powershell
npm ci
npm run build
```

Desde `backend`:

```powershell
dotnet restore Sahur.sln
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
```

También puede ejecutarse desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\verify.ps1
```
