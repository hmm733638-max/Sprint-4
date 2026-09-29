import { AuthenticatedUser } from '../entities/authenticated-user.entity';

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Promise<AuthenticatedUser>;
  abstract getSession(): Promise<AuthenticatedUser | null>;
  abstract logout(): Promise<void>;
}
