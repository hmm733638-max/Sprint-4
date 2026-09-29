import {
  AuthenticatedUser,
  UserRole
} from '../../domain/entities/authenticated-user.entity';
import { AuthError } from '../../domain/errors/auth.error';

export function mapAuthenticatedUser(value: unknown): AuthenticatedUser {
  if (typeof value !== 'object' || value === null) {
    throw new AuthError('invalid_response');
  }

  const user = value as Record<string, unknown>;
  const role = user['role'];

  if (
    typeof user['id'] !== 'number' ||
    !Number.isInteger(user['id']) ||
    user['id'] <= 0 ||
    typeof user['username'] !== 'string' ||
    !user['username'].trim() ||
    typeof user['email'] !== 'string' ||
    typeof user['firstName'] !== 'string' ||
    typeof user['lastName'] !== 'string' ||
    !isUserRole(role)
  ) {
    throw new AuthError('invalid_response');
  }

  return {
    id: user['id'],
    username: user['username'],
    email: user['email'],
    firstName: user['firstName'],
    lastName: user['lastName'],
    role
  };
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'Administrador' ||
    value === 'Auditor' ||
    value === 'Cliente';
}
