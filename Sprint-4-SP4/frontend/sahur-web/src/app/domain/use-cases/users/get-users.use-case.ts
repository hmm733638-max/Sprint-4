import { Inject, Injectable } from '@angular/core';
import { UserDirectoryEntry } from '../../entities/user-directory.entity';
import { USER_DIRECTORY_REPOSITORY, UserDirectoryRepository } from '../../repositories/user-directory.repository';

@Injectable({ providedIn: 'root' })
export class GetUsersUseCase {
  constructor(@Inject(USER_DIRECTORY_REPOSITORY) private readonly repository: UserDirectoryRepository) {}
  execute(): Promise<readonly UserDirectoryEntry[]> { return this.repository.getAll(); }
}
