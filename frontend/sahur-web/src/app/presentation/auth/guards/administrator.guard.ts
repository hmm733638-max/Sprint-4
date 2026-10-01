import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionViewModel } from '../view-models/session.viewmodel';

export const administratorGuard: CanActivateFn = async () => {
  const session = inject(SessionViewModel);
  const router = inject(Router);
  const authenticated = await session.restore();

  if (!authenticated) return router.createUrlTree(['/login']);
  return session.user()?.role === 'Administrador'
    ? true
    : router.createUrlTree(['/inicio']);
};
