import { computed, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutUseCase } from '../../../domain/use-cases/auth/logout.use-case';
import { SessionViewModel } from './session.viewmodel';

@Injectable()
export class MainViewModel {
  readonly user;

  readonly title = computed(() => {
    switch (this.user()?.role) {
      case 'Administrador':
        return 'Inicio de administración';
      case 'Auditor':
        return 'Inicio de auditoría';
      default:
        return 'Inicio de cliente';
    }
  });

  constructor(
    private readonly session: SessionViewModel,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly router: Router
  ) {
    this.user = session.user;
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.session.clearSession();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
