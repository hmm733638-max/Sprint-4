import { Injectable } from '@angular/core';
import { UserDirectoryEntry } from '../../domain/entities/user-directory.entity';
import { UserDirectoryRepository } from '../../domain/repositories/user-directory.repository';
import { UserDirectoryDataSource } from '../datasources/user-directory.datasource';
import { mapUserDirectoryDto } from '../mappers/user-directory.mapper';

@Injectable()
export class HttpUserDirectoryRepository implements UserDirectoryRepository {
  constructor(private readonly dataSource: UserDirectoryDataSource) {}
  async getAll(): Promise<readonly UserDirectoryEntry[]> { return (await this.dataSource.getAll()).map(mapUserDirectoryDto); }
}
