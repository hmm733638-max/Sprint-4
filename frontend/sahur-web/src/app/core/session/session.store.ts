import { Injectable, computed, signal } from '@angular/core';
import { AuthenticatedUser } from '../../domain/entities/authenticated-user.entity';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly currentUser = signal<AuthenticatedUser | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  setUser(user: AuthenticatedUser): void {
    this.currentUser.set(Object.freeze({ ...user }));
  }

  clear(): void {
    this.currentUser.set(null);
  }
}
