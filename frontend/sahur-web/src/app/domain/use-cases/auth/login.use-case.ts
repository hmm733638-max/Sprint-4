import { Inject, Injectable } from '@angular/core';
import { AuthenticatedUser, LoginCredentials } from '../../entities/auth.entity';
import { AuthError } from '../../errors/auth.error';
import { AUTH_REPOSITORY, AuthRepository } from '../../repositories/auth.repository';
import { CONNECTIVITY_REPOSITORY, ConnectivityRepository } from '../../repositories/connectivity.repository';
import { SESSION_REPOSITORY, SessionRepository } from '../../repositories/session.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly auth: AuthRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepository,
    @Inject(CONNECTIVITY_REPOSITORY) private readonly connectivity: ConnectivityRepository
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    if (!this.connectivity.isOnline()) throw new AuthError('offline');
    const session = await this.auth.login({ ...credentials, username: credentials.username.trim() });
    this.sessions.save({ accessToken: session.accessToken, expiresAt: session.expiresAt });
    return session.user;
  }
}
