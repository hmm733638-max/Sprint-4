import { InjectionToken } from '@angular/core';
import { SystemStatus } from '../entities/system-status.entity';

export interface SystemStatusRepository {
  get(): Promise<SystemStatus>;
}

export const SYSTEM_STATUS_REPOSITORY =
  new InjectionToken<SystemStatusRepository>('SystemStatusRepository');
