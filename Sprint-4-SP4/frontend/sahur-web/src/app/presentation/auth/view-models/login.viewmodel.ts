import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.use-case';
import { authErrorMessage } from '../auth-error-message';
import { SessionViewModel } from './session.viewmodel';

@Injectable()
export class LoginViewModel {
  private readonly usernameState = signal('');
  private readonly passwordState = signal('');
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  readonly username = this.usernameState.asReadonly();
  readonly password = this.passwordState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = computed(() => this.errorState() ?? this.session.error());

  constructor(
    private readonly login: LoginUseCase,
    private readonly session: SessionViewModel,
    private readonly router: Router
  ) {}

  setUsername(value: string): void { this.usernameState.set(value); }
  setPassword(value: string): void { this.passwordState.set(value); }

  async submit(): Promise<void> {
    if (this.loading()) return;
    if (!this.username().trim() || !this.password()) {
      this.errorState.set('Escribe tu usuario y contraseña.');
      return;
    }
    this.loadingState.set(true);
    this.errorState.set(null);
    this.session.clearError();
    try {
      await this.login.execute({ username: this.username(), password: this.password() });
      await this.router.navigateByUrl('/inicio');
    } catch (error) {
      this.errorState.set(authErrorMessage(error));
    } finally {
      this.passwordState.set('');
      this.loadingState.set(false);
    }
  }
}
