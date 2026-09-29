import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../../domain/entities/authenticated-user.entity';
import { AuthError } from '../../domain/errors/auth.error';
import {
  AuthRepository,
  LoginCredentials
} from '../../domain/repositories/auth.repository';
import { mapAuthenticatedUser } from '../mappers/authenticated-user.mapper';

@Injectable()
export class HttpAuthRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  override async login(
    credentials: LoginCredentials
  ): Promise<AuthenticatedUser> {
    try {
      const token = await this.getCsrfToken();

      const response = await firstValueFrom(
        this.http.post<unknown>(
          `${this.authUrl}/login`,
          credentials,
          { headers: { 'X-CSRF-TOKEN': token } }
        ).pipe(timeout(35000))
      );

      return mapAuthenticatedUser(response);
    } catch (error: unknown) {
      throw this.mapError(error);
    }
  }

  override async getSession(): Promise<AuthenticatedUser | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<unknown>(
          `${this.authUrl}/session`
        ).pipe(timeout(10000))
      );

      return mapAuthenticatedUser(response);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return null;
      }

      throw this.mapError(error);
    }
  }

  override async logout(): Promise<void> {
    try {
      // Se obtiene un token CSRF nuevo para la identidad actual.
      const token = await this.getCsrfToken();

      await firstValueFrom(
        this.http.post<void>(
          `${this.authUrl}/logout`,
          {},
          { headers: { 'X-CSRF-TOKEN': token } }
        ).pipe(timeout(10000))
      );
    } catch (error: unknown) {
      throw this.mapError(error);
    }
  }

  private async getCsrfToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ requestToken: string }>(
        `${this.authUrl}/csrf`
      ).pipe(timeout(10000))
    );

    if (
      !response ||
      typeof response.requestToken !== 'string' ||
      !response.requestToken
    ) {
      throw new AuthError('invalid_response');
    }

    return response.requestToken;
  }

  private mapError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return new AuthError('connection');
        case 401:
          return new AuthError('invalid_credentials');
        case 400:
        case 403:
          return new AuthError('request_rejected');
        case 502:
        case 503:
        case 504:
          return new AuthError('unavailable');
      }
    }

    if (error instanceof Error && error.name === 'TimeoutError') {
      return new AuthError('connection');
    }

    return new AuthError('invalid_response');
  }
}
