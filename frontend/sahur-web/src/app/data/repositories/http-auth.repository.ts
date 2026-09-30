import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { AuthenticatedUser, AuthSession, LoginCredentials } from '../../domain/entities/auth.entity';
import { AuthError } from '../../domain/errors/auth.error';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthDataSource } from '../datasources/auth.datasource';
import { mapAuthenticatedUser, mapAuthSession } from '../mappers/auth.mapper';

@Injectable()
export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      return mapAuthSession(await this.dataSource.login(credentials));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async getCurrentUser(accessToken: string): Promise<AuthenticatedUser> {
    try {
      return mapAuthenticatedUser(await this.dataSource.getCurrentUser(accessToken));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): AuthError {
    if (error instanceof AuthError) return error;
    if (error instanceof HttpErrorResponse && error.status === 401) return new AuthError('credentials');
    if (error instanceof TimeoutError || (error instanceof HttpErrorResponse && error.status === 0)) {
      return new AuthError('connection');
    }
    return new AuthError('unexpected');
  }
}
