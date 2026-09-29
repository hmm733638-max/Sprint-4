import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStore } from '../../../core/session/session.store';
import {
  AuthError,
  AuthErrorCode
} from '../../../domain/errors/auth.error';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.use-case';

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_input: 'Escribe tu usuario y contraseña.',
  invalid_credentials: 'Usuario o contraseña inválidos',
  offline: 'No tienes conexión a internet. Revisa tu conexión.',
  connection: 'No fue posible conectar con Sahur. Revisa tu conexión e inténtalo nuevamente.',
  unavailable: 'El servicio no está disponible. Inténtalo nuevamente.',
  invalid_response: 'No fue posible completar el inicio de sesión.',
  request_rejected: 'La solicitud no pudo validarse. Inténtalo nuevamente.'
};

@Injectable()
export class LoginViewModel implements OnDestroy {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  private destroyed = false;

  readonly username = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);

  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  async submit(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const user = await this.loginUseCase.execute({
        username: this.username(),
        password: this.password()
      });

      if (this.destroyed) {
        return;
      }

      this.session.setUser(user);

      const navigated = await this.router.navigateByUrl('/catalogo', {
        replaceUrl: true
      });

      if (!navigated && !this.destroyed) {
        this.errorState.set(
          'La sesión inició, pero no fue posible abrir el catálogo.'
        );
      }
    } catch (error: unknown) {
      if (!this.destroyed) {
        this.errorState.set(
          error instanceof AuthError
            ? ERROR_MESSAGES[error.code]
            : 'Ocurrió un error inesperado. Inténtalo nuevamente.'
        );
      }
    } finally {
      this.password.set('');
      this.showPassword.set(false);
      this.loadingState.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.password.set('');
  }
}
