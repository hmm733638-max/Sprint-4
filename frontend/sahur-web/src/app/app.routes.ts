import { Routes } from '@angular/router';
import { administratorGuard } from './presentation/auth/guards/administrator.guard';
import { authenticatedGuard } from './presentation/auth/guards/authenticated.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'login',
    title: 'Iniciar sesión | SAHUR',
    loadComponent: () => import('./presentation/auth/views/login.view').then(module => module.LoginView)
  },
  {
    path: 'inicio',
    title: 'Inicio | SAHUR',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./presentation/auth/views/main.view').then(module => module.MainView)
  },
  {
    path: 'productos/nuevo',
    title: 'Agregar producto | SAHUR',
    canActivate: [administratorGuard],
    loadComponent: () => import('./presentation/product-create/views/product-create.view').then(module => module.ProductCreateView)
  },
  {
    path: 'productos/:id',
    title: 'Detalle de producto | SAHUR',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./presentation/product-detail/views/product-detail.view').then(module => module.ProductDetailView)
  },
  {
    path: 'diagnostico',
    title: 'SAHUR Sprint 4',
    loadComponent: () =>
      import('./presentation/home/views/home.view')
        .then(module => module.HomeView)
  },
  { path: '**', redirectTo: '' }
];
