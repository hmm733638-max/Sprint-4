import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionViewModel } from '../view-models/session.viewmodel';

export const clientGuard: CanActivateFn = async () => {
  const session = inject(SessionViewModel);
  const router = inject(Router);

  const authenticated = await session.restore();

  if (!authenticated) {
    return router.createUrlTree(['/login']);
  }

  return session.user()?.role === 'Cliente'
    ? true
    : router.createUrlTree(['/inicio']);
};