import { Injectable, inject } from '@angular/core';
import { GetSessionUseCase } from '../../domain/use-cases/auth/get-session.use-case';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionCoordinator {
  private readonly getSession = inject(GetSessionUseCase);
  private readonly session = inject(SessionStore);
  private pending: Promise<void> | null = null;

  restore(): Promise<void> {
    if (this.pending) {
      return this.pending;
    }

    this.pending = this.load().finally(() => {
      this.pending = null;
    });

    return this.pending;
  }

  private async load(): Promise<void> {
    try {
      const user = await this.getSession.execute();

      if (user) {
        this.session.setUser(user);
      } else {
        this.session.clear();
      }
    } catch (error: unknown) {
      this.session.clear();
      throw error;
    }
  }
}
