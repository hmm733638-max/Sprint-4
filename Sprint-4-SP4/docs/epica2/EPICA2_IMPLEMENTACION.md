# SAHUR Sprint 4 — Épica 2 (US03, US04 y US05)

## Base utilizada

La implementación parte de `SP4` después de la integración de Épica 1 (US01 login con backend propio y US02 logout). No restaura Fake Store API ni ningún proveedor de productos externo.

La persistencia de productos usa `SahurDbContext` + EF Core InMemory. Los productos iniciales se cargan desde `ProductDatabaseSeeder` en Infrastructure. Las imágenes son SVG servidos por la propia API desde `wwwroot/product-images`; no dependen de CDN ni servicios externos.

## Adaptación de las historias originales

Los documentos originales conservan referencias históricas a Fake Store API. La regla vigente del proyecto reemplaza esa dependencia por el backend propio SAHUR. Por ello:

- `/products` se implementa como `GET /api/products`.
- `/products/categories` se implementa como `GET /api/products/categories`.
- `/products/category/{category}` se implementa como `GET /api/products/category/{category}`.
- `/products/{id}` se implementa como `GET /api/products/{id}`.

El frontend solamente consume `Sahur.Api`.

## US03 — Visualizar catálogo general de productos

Actor: usuario autenticado con rol Administrador, Cliente o Auditor.

### Criterios cubiertos

- Renderiza catálogo en cuadrícula.
- Cada tarjeta muestra imagen, título y precio.
- Las imágenes usan `loading="lazy"` y `decoding="async"`.
- Angular usa `@for (...; track product.id)` y `content-visibility` para evitar trabajo visual innecesario fuera del viewport.
- Muestra spinner durante la carga.
- En error detiene loading, muestra mensaje amigable y botón `Reintentar`.
- El JSON se recibe en `ProductDto`, se mapea a `Product` de dominio y solo después llega a la presentación.

### Flujo frontend

`CatalogView -> CatalogViewModel -> GetProductsUseCase -> ProductRepository -> HttpProductRepository -> ProductDataSource -> HttpProductDataSource -> Sahur.Api`

### Flujo backend

`ProductsController -> GetProductsQuery -> GetProductsQueryHandler -> IProductReadRepository -> EfProductReadRepository -> SahurDbContext -> EF Core InMemory`

## US04 — Filtrar productos por categoría

### Criterios cubiertos

- Al inicializar se consultan categorías.
- Las categorías se muestran como chips horizontales accesibles.
- Seleccionar una categoría consulta únicamente sus productos.
- `Ver todos` elimina el filtro y vuelve al catálogo completo.
- Antes de cada cambio de fuente el ViewModel limpia el arreglo de productos.
- Cada cambio activa el mismo estado de loading utilizado por el catálogo.

### Flujo

`CatalogView -> CatalogViewModel.selectCategory -> GetProductsByCategoryUseCase -> ProductRepository -> HTTP -> ProductsController -> GetProductsByCategoryQuery -> Handler -> Repository -> EF InMemory`

Las categorías usan `GetProductCategoriesUseCase` y `GetProductCategoriesQuery` con su handler independiente.

## US05 — Ver detalle del producto con interfaz dinámica

### Perfiles Cliente y Auditor

- Imagen.
- Título.
- Precio.
- Descripción completa.
- Categoría.
- No se crean controles de Editar/Eliminar en la jerarquía visual.

### Perfil Administrador

El rol para la presentación se lee del estado local de sesión (`SessionViewModel.user`). Los controles se encuentran dentro de `@if (vm.isAdministrator())`, por lo que Cliente/Auditor no los instancian.

Además de la ocultación de interfaz, las operaciones de escritura también están protegidas en backend mediante `[Authorize(Roles = "Administrador")]`.

### Edición y eliminación

La historia exige que los botones sean funcionales. Para hacerlos funcionales dentro del backend propio se añaden:

- `PUT /api/products/{id}` -> `UpdateProductCommand`.
- `DELETE /api/products/{id}` -> `DeleteProductCommand`.

La edición permite modificar título, precio, descripción y categoría; la imagen se conserva. El borrado solicita confirmación en la interfaz.

### Error

Si `GET /api/products/{id}` falla o devuelve 404, la vista muestra `Producto no disponible` y vuelve automáticamente a `/inicio`.

## CQRS backend

### Queries

- `GetProductsQuery`
- `GetProductCategoriesQuery`
- `GetProductsByCategoryQuery`
- `GetProductByIdQuery`

Cada Query tiene un QueryHandler dedicado y no escribe estado.

### Commands

- `UpdateProductCommand`
- `DeleteProductCommand`

Cada Command tiene un CommandHandler dedicado y utiliza `IProductWriteRepository` + `IUnitOfWork.SaveChangesAsync`.

## SOLID

- SRP: lectura y escritura de productos están separadas en repositorios distintos.
- OCP/DIP: Application depende de `IProductReadRepository` / `IProductWriteRepository`; Infrastructure aporta implementaciones EF.
- ISP: los handlers de lectura no reciben métodos de escritura y viceversa.
- LSP: los contratos no dependen del proveedor InMemory.
- DI: repositorios, DataSources y adaptadores se registran en los composition roots correspondientes.

## Persistencia

`Product` está en Domain.

`SahurDbContext.Products` y `ProductConfiguration` están en Infrastructure.

`ProductDatabaseSeeder` crea 12 productos distribuidos en:

- Electrónica
- Accesorios
- Ropa
- Papelería

No se usan listas globales, Controllers con DbContext ni datos hardcodeados en Angular.

## Archivos principales añadidos

### Backend

- `Sahur.Domain/Products/Product.cs`
- `Sahur.Application/Abstractions/IProductReadRepository.cs`
- `Sahur.Application/Abstractions/IProductWriteRepository.cs`
- `Sahur.Application/Products/Models/ProductReadModel.cs`
- `Sahur.Application/Products/Queries/*`
- `Sahur.Application/Products/Commands/*`
- `Sahur.Infrastructure/Products/EfProductReadRepository.cs`
- `Sahur.Infrastructure/Products/EfProductWriteRepository.cs`
- `Sahur.Infrastructure/Persistence/ProductDatabaseSeeder.cs`
- `Sahur.Infrastructure/Persistence/Configurations/ProductConfiguration.cs`
- `Sahur.Api/Controllers/ProductsController.cs`
- `Sahur.Api/Contracts/Products/UpdateProductRequest.cs`
- `Sahur.Api/wwwroot/product-images/*.svg`
- `Sahur.ProductsTests/*`

### Frontend

- `domain/entities/product.entity.ts`
- `domain/repositories/product.repository.ts`
- `domain/use-cases/products/*`
- `data/dto/product.dto.ts`
- `data/mappers/product.mapper.ts`
- `data/datasources/product.datasource.ts`
- `data/datasources/http-product.datasource.ts`
- `data/repositories/http-product.repository.ts`
- `presentation/catalog/*`
- `presentation/product-detail/*`

## Verificación recomendada

Desde `frontend/sahur-web`:

```bash
npm ci
npm run build
```

Desde `backend`:

```bash
dotnet restore Sahur.sln
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
```

`Sahur.ProductsTests` verifica autenticación del catálogo, lectura general, categorías, filtro, detalle, 404, autorización de Cliente y escritura de Administrador.
