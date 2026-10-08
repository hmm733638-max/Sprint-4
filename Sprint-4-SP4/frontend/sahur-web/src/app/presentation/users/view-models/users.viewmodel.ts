import { Injectable, signal } from '@angular/core';
import { UserDirectoryEntry } from '../../../domain/entities/user-directory.entity';
import { GetUsersUseCase } from '../../../domain/use-cases/users/get-users.use-case';

@Injectable()
export class UsersViewModel {
  private readonly usersState = signal<readonly UserDirectoryEntry[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  readonly users = this.usersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor(private readonly getUsers: GetUsersUseCase) {}

  async initialize(): Promise<void> {
    if (this.loading()) return;
    this.loadingState.set(true);
    this.errorState.set(null);
    try { this.usersState.set(await this.getUsers.execute()); }
    catch { this.usersState.set([]); this.errorState.set('No fue posible cargar el directorio de usuarios. Revisa la conexión con el servidor.'); }
    finally { this.loadingState.set(false); }
  }

  retry(): void { void this.initialize(); }
}
