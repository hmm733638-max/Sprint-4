import { AuthenticatedUser, AuthSession } from '../../domain/entities/auth.entity';
import { AuthError } from '../../domain/errors/auth.error';
import { AuthenticatedUserDto, LoginResponseDto } from '../dto/auth.dto';

export function mapAuthenticatedUser(dto: AuthenticatedUserDto): AuthenticatedUser {
  if (!dto || !Number.isInteger(dto.id) || dto.id <= 0 || typeof dto.username !== 'string'
    || !['Administrador', 'Auditor', 'Cliente'].includes(dto.role)) {
    throw new AuthError('unexpected');
  }
  return { id: dto.id, username: dto.username, role: dto.role as AuthenticatedUser['role'] };
}

export function mapAuthSession(dto: LoginResponseDto): AuthSession {
  if (!dto || typeof dto.accessToken !== 'string' || !dto.accessToken || dto.tokenType !== 'Bearer'
    || typeof dto.expiresAt !== 'string' || !Number.isFinite(Date.parse(dto.expiresAt))) {
    throw new AuthError('unexpected');
  }
  return { accessToken: dto.accessToken, expiresAt: dto.expiresAt, user: mapAuthenticatedUser(dto.user) };
}
