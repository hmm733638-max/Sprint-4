import { Inject, Injectable } from '@angular/core';
import { SystemStatus } from '../../entities/system-status.entity';
import {
  SYSTEM_STATUS_REPOSITORY,
  SystemStatusRepository
} from '../../repositories/system-status.repository';

@Injectable({ providedIn: 'root' })
export class GetSystemStatusUseCase {
  constructor(
    @Inject(SYSTEM_STATUS_REPOSITORY)
    private readonly repository: SystemStatusRepository
  ) {}

  execute(): Promise<SystemStatus> {
    return this.repository.get();
  }
}
