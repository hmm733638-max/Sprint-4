import { Injectable, signal } from '@angular/core';
import { AuthenticatedUser } from '../../../domain/entities/auth.entity';
import { RestoreSessionUseCase } from '../../../domain/use-cases/auth/restore-session.use-case';
import { authErrorMessage } from '../auth-error-message';

@Injectable({ providedIn: 'root' })
export class SessionViewModel {
  private readonly userState = signal<AuthenticatedUser | null>(null);
  private readonly errorState = signal<string | null>(null);
  readonly user = this.userState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor(private readonly restoreSession: RestoreSessionUseCase) {}

  async restore(): Promise<boolean> {
    this.errorState.set(null);
    try {
      this.userState.set(await this.restoreSession.execute());
      return this.userState() !== null;
    } catch (error) {
      this.userState.set(null);
      this.errorState.set(authErrorMessage(error));
      return false;
    }
  }

  clearError(): void { this.errorState.set(null); }
}
