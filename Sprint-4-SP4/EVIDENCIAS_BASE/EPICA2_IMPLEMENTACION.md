# Evidencias de implementación — Épica 2

## US03

- [x] Catálogo general protegido por autenticación.
- [x] Imagen, título y precio por producto.
- [x] Estado Loading.
- [x] Error amigable y Reintentar.
- [x] DTO -> Mapper -> Entity.
- [x] Imágenes asíncronas y renderizado eficiente.

## US04

- [x] Categorías desde backend propio.
- [x] Filtro por categoría.
- [x] Ver todos.
- [x] Limpieza del arreglo anterior antes del cambio.
- [x] Loading consistente.

## US05

- [x] Detalle por ID.
- [x] Cliente/Auditor sin componentes administrativos instanciados.
- [x] Administrador con Editar y Eliminar.
- [x] Autorización backend para escrituras.
- [x] Producto no disponible + retorno automático.

## Arquitectura

- [x] Angular MVVM: View -> ViewModel -> Use Case -> Repository -> DataSource -> HttpClient.
- [x] Backend CQRS: Controller -> Command/Query -> Handler -> Repository -> EF Core.
- [x] SOLID/DI.
- [x] Sin Fake Store API.
- [x] Sin APIs externas de catálogo.
- [x] EF Core InMemory mediante DbContext/DbSet/Repositories/SaveChangesAsync.

## Pruebas incorporadas

Proyecto: `backend/Sahur.ProductsTests`.

Casos cubiertos:

- catálogo requiere sesión;
- catálogo/categorías/filtro/detalle para usuario autenticado;
- 404 de detalle inexistente;
- Cliente no puede editar/eliminar;
- Administrador puede editar/eliminar.
