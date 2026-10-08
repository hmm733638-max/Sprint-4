import { InjectionToken } from '@angular/core';
import { StoredSession } from '../entities/auth.entity';

export interface SessionRepository {
  read(): StoredSession | null;
  save(session: StoredSession): void;
  clear(): void;
}

export const SESSION_REPOSITORY = new InjectionToken<SessionRepository>('SessionRepository');
