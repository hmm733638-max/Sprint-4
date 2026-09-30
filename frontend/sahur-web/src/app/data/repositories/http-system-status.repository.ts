import { Injectable } from '@angular/core';
import { SystemStatus } from '../../domain/entities/system-status.entity';
import { SystemStatusRepository } from '../../domain/repositories/system-status.repository';
import { SystemStatusDataSource } from '../datasources/system-status.datasource';
import { mapSystemStatusDto } from '../mappers/system-status.mapper';

@Injectable()
export class HttpSystemStatusRepository implements SystemStatusRepository {
  constructor(private readonly dataSource: SystemStatusDataSource) {}

  async get(): Promise<SystemStatus> {
    return mapSystemStatusDto(await this.dataSource.get());
  }
}
