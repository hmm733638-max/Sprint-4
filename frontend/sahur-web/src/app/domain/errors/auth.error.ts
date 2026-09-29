export type AuthErrorCode =
  | 'invalid_input'
  | 'invalid_credentials'
  | 'offline'
  | 'connection'
  | 'unavailable'
  | 'invalid_response'
  | 'request_rejected';

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
  }
}
