export type AuthErrorCode = 'credentials' | 'offline' | 'connection' | 'storage' | 'unexpected';

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
  }
}
