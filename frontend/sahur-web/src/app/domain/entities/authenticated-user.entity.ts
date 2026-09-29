export type UserRole = 'Administrador' | 'Auditor' | 'Cliente';

export interface AuthenticatedUser {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
}
