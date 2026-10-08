import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionViewModel } from '../view-models/session.viewmodel';

export const auditGuard: CanActivateFn = async () => {
  const session = inject(SessionViewModel);
  const router = inject(Router);
  if (!await session.restore()) return router.createUrlTree(['/login']);
  return ['Administrador', 'Auditor'].includes(session.user()?.role ?? '')
    ? true
    : router.createUrlTree(['/inicio']);
};
