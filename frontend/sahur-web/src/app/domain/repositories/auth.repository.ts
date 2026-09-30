import { InjectionToken } from '@angular/core';
import { AuthenticatedUser, AuthSession, LoginCredentials } from '../entities/auth.entity';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  getCurrentUser(accessToken: string): Promise<AuthenticatedUser>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');
