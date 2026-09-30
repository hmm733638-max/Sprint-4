import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'SAHUR Sprint 4',
    loadComponent: () =>
      import('./presentation/home/views/home.view')
        .then(module => module.HomeView)
  },
  { path: '**', redirectTo: '' }
];
