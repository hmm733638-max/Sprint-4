import { Injectable } from '@angular/core';
import { StoredSession } from '../../domain/entities/auth.entity';
import { AuthError } from '../../domain/errors/auth.error';
import { SessionRepository } from '../../domain/repositories/session.repository';

@Injectable()
export class BrowserSessionRepository implements SessionRepository {
  private readonly key = 'sahur.session';

  read(): StoredSession | null {
    let raw: string | null;
    try { raw = sessionStorage.getItem(this.key); }
    catch { throw new AuthError('storage'); }
    if (!raw) return null;
    try {
      const value: unknown = JSON.parse(raw);
      if (typeof value === 'object' && value !== null && 'accessToken' in value && 'expiresAt' in value
        && typeof value.accessToken === 'string' && value.accessToken.length > 0
        && typeof value.expiresAt === 'string' && Number.isFinite(Date.parse(value.expiresAt))) {
        return { accessToken: value.accessToken, expiresAt: value.expiresAt };
      }
    } catch { /* Una sesión dañada se descarta y exige iniciar sesión de nuevo. */ }
    this.clear();
    return null;
  }

  save(session: StoredSession): void {
    try { sessionStorage.setItem(this.key, JSON.stringify(session)); }
    catch { throw new AuthError('storage'); }
  }

  clear(): void {
    try { sessionStorage.removeItem(this.key); }
    catch { throw new AuthError('storage'); }
  }
}
