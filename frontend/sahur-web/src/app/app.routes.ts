import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Iniciar sesión | Sahur',
    loadComponent: () =>
      import('./presentation/auth/views/login.view')
        .then(module => module.LoginView)
  },
  {
    path: 'catalogo/:id',
    canActivate: [authGuard],
    title: 'Detalle de producto | Sahur',
    loadComponent: () =>
      import('./presentation/product-detail/views/product-detail.view')
        .then(module => module.ProductDetailView)
  },
  {
    path: 'catalogo',
    canActivate: [authGuard],
    title: 'Catálogo | Sahur',
    loadComponent: () =>
      import('./presentation/catalog/views/catalog.view')
        .then(module => module.CatalogView)
  },
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: '**', redirectTo: 'catalogo' }
];
