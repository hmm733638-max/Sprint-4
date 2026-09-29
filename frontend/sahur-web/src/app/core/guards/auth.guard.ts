import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionCoordinator } from '../session/session.coordinator';
import { SessionStore } from '../session/session.store';

export const authGuard: CanActivateFn = async () => {
  const coordinator = inject(SessionCoordinator);
  const session = inject(SessionStore);
  const router = inject(Router);

  try {
    await coordinator.restore();
  } catch {
    return router.createUrlTree(['/login']);
  }

  return session.isAuthenticated()
    ? true
    : router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = async () => {
  const coordinator = inject(SessionCoordinator);
  const session = inject(SessionStore);
  const router = inject(Router);

  try {
    await coordinator.restore();
  } catch {
    return true;
  }

  return session.isAuthenticated()
    ? router.createUrlTree(['/catalogo'])
    : true;
};
