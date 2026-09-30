import { Routes } from '@angular/router';
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
    path: 'diagnostico',
    title: 'SAHUR Sprint 4',
    loadComponent: () =>
      import('./presentation/home/views/home.view')
        .then(module => module.HomeView)
  },
  { path: '**', redirectTo: '' }
];
