export type UserRole = 'Administrador' | 'Auditor' | 'Cliente';

export interface AuthenticatedUser {
  readonly id: number;
  readonly username: string;
  readonly role: UserRole;
}

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface StoredSession {
  readonly accessToken: string;
  readonly expiresAt: string;
}

export interface AuthSession extends StoredSession {
  readonly user: AuthenticatedUser;
}
