import { Injectable, signal } from '@angular/core';
import { SystemStatus } from '../../../domain/entities/system-status.entity';
import { GetSystemStatusUseCase } from '../../../domain/use-cases/system/get-system-status.use-case';

@Injectable()
export class HomeViewModel {
  private readonly statusState = signal<SystemStatus | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly status = this.statusState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor(private readonly getSystemStatus: GetSystemStatusUseCase) {}

  async loadStatus(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      this.statusState.set(await this.getSystemStatus.execute());
    } catch {
      this.statusState.set(null);
      this.errorState.set(
        'No fue posible verificar el backend. Confirma que la API esté ejecutándose en el puerto 5000.'
      );
    } finally {
      this.loadingState.set(false);
    }
  }
}
