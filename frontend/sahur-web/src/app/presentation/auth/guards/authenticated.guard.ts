import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionViewModel } from '../view-models/session.viewmodel';

export const authenticatedGuard: CanActivateFn = async () => {
  const session = inject(SessionViewModel);
  const router = inject(Router);
  return await session.restore() ? true : router.createUrlTree(['/login']);
};
