import { Inject, Injectable } from '@angular/core';
import { AuthenticatedUser } from '../../entities/auth.entity';
import { AuthError } from '../../errors/auth.error';
import { AUTH_REPOSITORY, AuthRepository } from '../../repositories/auth.repository';
import { SESSION_REPOSITORY, SessionRepository } from '../../repositories/session.repository';

@Injectable({ providedIn: 'root' })
export class RestoreSessionUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly auth: AuthRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepository
  ) {}

  async execute(): Promise<AuthenticatedUser | null> {
    const session = this.sessions.read();
    if (!session) return null;
    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.sessions.clear();
      return null;
    }

    try {
      return await this.auth.getCurrentUser(session.accessToken);
    } catch (error) {
      if (error instanceof AuthError && error.code === 'credentials') {
        this.sessions.clear();
        return null;
      }
      throw error;
    }
  }
}
