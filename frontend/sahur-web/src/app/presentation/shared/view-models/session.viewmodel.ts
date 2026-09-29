import { Injectable, inject, signal } from '@angular/core';
import { SessionStore } from '../../../core/session/session.store';
import { SessionNavigationService } from '../../../core/session/session-navigation.service';
import { AuthError } from '../../../domain/errors/auth.error';
import { LogoutUseCase } from '../../../domain/use-cases/auth/logout.use-case';

@Injectable()
export class SessionViewModel {
  private readonly session = inject(SessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly navigation = inject(SessionNavigationService);

  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly user = this.session.user;
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  async logout(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await this.logoutUseCase.execute();
    } catch (error: unknown) {
      const connectionProblem =
        error instanceof AuthError &&
        (error.code === 'offline' || error.code === 'connection');

      this.errorState.set(
        connectionProblem
          ? 'No se pudo confirmar el cierre de sesión. Revisa tu conexión e inténtalo nuevamente.'
          : 'No se pudo cerrar la sesión. Inténtalo nuevamente.'
      );

      this.loadingState.set(false);
      return;
    }

    this.session.clear();
    this.navigation.exitToLogin();
  }
}
