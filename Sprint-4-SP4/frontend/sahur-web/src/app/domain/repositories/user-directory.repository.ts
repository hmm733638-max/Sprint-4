import { InjectionToken } from '@angular/core';
import { UserDirectoryEntry } from '../entities/user-directory.entity';

export interface UserDirectoryRepository {
  getAll(): Promise<readonly UserDirectoryEntry[]>;
}

export const USER_DIRECTORY_REPOSITORY = new InjectionToken<UserDirectoryRepository>('UserDirectoryRepository');
