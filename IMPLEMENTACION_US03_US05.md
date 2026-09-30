# SAHUR Sprint 4 — implementación US03, US04 y US05

## Base utilizada

El ZIP recibido ya contiene el merge de US01/US02 en la referencia `origin/SP4` (`9bc87de`, `Merge pull request #2 ... SP4-US01-02-AUTH`). El trabajo de US03-US05 se construyó encima de esa base; no se reescribió autenticación, sesión ni logout.

La arquitectura conservada es:

`Angular View -> ViewModel -> Use Case -> Repository Interface -> HTTP Repository -> Sahur.Api -> Query -> Handler -> IProductReadRepository -> Fake Store API`.

No se añadió `HttpClient` a Views ni ViewModels, no se añadió acceso directo a Fake Store desde Angular y los Controllers continúan delgados.

## US03 — Visualizar catálogo general de productos

Actor: usuario autenticado con rol Administrador, Cliente o Auditor.

Objetivo implementado: cargar `GET /api/products`, mostrar imagen, título y precio, representar el estado de carga y mostrar un error amigable con botón `Reintentar`.

Frontend:

- `domain/entities/product.entity.ts`: entidad de producto ya existente.
- `domain/repositories/product.repository.ts`: contrato de lectura del catálogo.
- `domain/use-cases/products/get-products.use-case.ts`: caso de uso existente reutilizado.
- `data/dto/product.dto.ts` y `data/mappers/product.mapper.ts`: DTO y mapper existentes reutilizados.
- `data/repositories/http-product.repository.ts`: implementación HTTP.
- `presentation/catalog/view-models/catalog.viewmodel.ts`: estado, loading, error y reintento.
- `presentation/catalog/views/catalog.view.*`: renderizado del catálogo.

Backend:

- `ProductsController.GET /api/products`.
- `GetProductsQuery` + `GetProductsQueryHandler`.
- `IProductReadRepository.GetAllAsync`.
- `FakeStoreProductReadRepository.GetAllAsync` -> Fake Store `/products`.

Rendimiento de la interfaz: las imágenes usan `loading="lazy"` y `decoding="async"`, los elementos Angular usan `@for (...; track product.id)` y las tarjetas usan `content-visibility: auto` para diferir trabajo visual fuera del viewport.

## US04 — Filtrar productos por categoría

Actor: usuario autenticado.

Objetivo implementado: obtener categorías, seleccionar una categoría, cargar exclusivamente sus productos y volver a `Ver todos`.

Lecturas añadidas:

- `GET /api/products/categories`.
- `GET /api/products/category/{category}`.
- `GET /api/products` para remover el filtro.

CQRS backend:

- `GetProductCategoriesQuery` + Handler.
- `GetProductsByCategoryQuery` + Handler.

Frontend:

- `GetProductCategoriesUseCase`.
- `GetProductsByCategoryUseCase`.
- métodos `getCategories()` y `getByCategory()` en `ProductRepository` y `HttpProductRepository`.
- chips horizontales accesibles en la View.
- `CatalogViewModel` limpia `productsState` antes de cada cambio de fuente de datos, activa loading y carga el nuevo arreglo.

## US05 — Ver detalle del producto con interfaz dinámica

Actores: Administrador, Cliente y Auditor.

Lectura añadida:

- `GET /api/products/{id}`.
- `GetProductByIdQuery` + Handler.
- `IProductReadRepository.GetByIdAsync`.
- `FakeStoreProductReadRepository.GetByIdAsync`.

Frontend:

- `GetProductByIdUseCase`.
- ruta protegida `/catalogo/:id`.
- `ProductDetailViewModel`.
- `product-detail.view.*`.
- `CatalogNavigationService` para navegación sin colocar Router dentro de los casos de uso.

La vista de detalle muestra imagen, título, precio, descripción y categoría. La decisión de mostrar opciones de gestión lee el rol desde `SessionStore`, es decir, desde el estado local de sesión del frontend; no consulta Fake Store para decidir permisos.

Para Cliente y Auditor los controles `Editar` y `Eliminar` ni siquiera se crean en el árbol visual porque están dentro de `@if (vm.isAdministrator())`.

### Límite deliberado de US05

US05 exige mostrar botones de gestión al Administrador, pero los documentos proporcionados no definen el contrato de escritura para editar/eliminar (campos editables, confirmación, endpoint, persistencia, validaciones ni comportamiento posterior). Como la regla del proyecto prohíbe inventar requisitos, no se añadieron Commands de edición/eliminación ni mutaciones contra Fake Store/EF InMemory. Los botones están conectados a una acción de UI explícita para demostrar la autorización, pero la escritura real debe incorporarse cuando se adjunte la User Story que la defina.

Esto evita mezclar una historia de lectura/detalle con operaciones de escritura no especificadas y mantiene CQRS estricto.

## Archivos backend nuevos

- `Sahur.Application/Products/Models/ProductReadModel.cs`
- `Sahur.Application/Products/Queries/GetProductCategories/*`
- `Sahur.Application/Products/Queries/GetProductsByCategory/*`
- `Sahur.Application/Products/Queries/GetProductById/*`

## Archivos frontend nuevos

- `core/navigation/catalog-navigation.service.ts`
- `domain/use-cases/products/get-product-categories.use-case.ts`
- `domain/use-cases/products/get-products-by-category.use-case.ts`
- `domain/use-cases/products/get-product-by-id.use-case.ts`
- `presentation/catalog/views/catalog.view.html`
- `presentation/catalog/views/catalog.view.css`
- `presentation/product-detail/view-models/product-detail.viewmodel.ts`
- `presentation/product-detail/views/product-detail.view.ts`
- `presentation/product-detail/views/product-detail.view.html`
- `presentation/product-detail/views/product-detail.view.css`

## Flujo completo

US03:

`CatalogView -> CatalogViewModel.loadAll -> GetProductsUseCase -> ProductRepository -> HttpProductRepository -> GET /api/products -> ProductsController -> GetProductsQuery -> Handler -> IProductReadRepository -> FakeStoreProductReadRepository -> Fake Store /products`.

US04:

`CatalogView -> CatalogViewModel.selectCategory -> GetProductsByCategoryUseCase -> ProductRepository -> HttpProductRepository -> GET /api/products/category/{category} -> ProductsController -> GetProductsByCategoryQuery -> Handler -> IProductReadRepository -> Fake Store /products/category/{category}`.

US05:

`CatalogView -> CatalogNavigationService -> ProductDetailView -> ProductDetailViewModel.load -> GetProductByIdUseCase -> ProductRepository -> HttpProductRepository -> GET /api/products/{id} -> ProductsController -> GetProductByIdQuery -> Handler -> IProductReadRepository -> Fake Store /products/{id}`.

Si la consulta de US05 falla o el producto no existe, la View presenta `Producto no disponible` y el ViewModel ordena el retorno automático al catálogo.

## Verificación realizada al preparar este ZIP

- `git diff --check`: sin errores de whitespace.
- Se verificaron programáticamente todas las importaciones relativas de los archivos TypeScript modificados/nuevos: no hay rutas locales rotas.
- Se confirmó que el trabajo parte del commit local `origin/SP4` que ya contiene el merge de US01/US02.
- No se tocaron los flujos de login, sesión y logout de US01/US02.

El sandbox usado para preparar el ZIP no dispone del .NET SDK 10 y no tiene acceso de red al registro npm, por lo que aquí no fue posible completar `npm ci`, `dotnet build` ni `dotnet test`. Por eso se incluyen `scripts/prepare-environment.ps1` y `scripts/verify.ps1`: en tu Windows deben ejecutarse antes del push y se detendrán si falla build o pruebas.
