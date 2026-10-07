import { UserDirectoryDto } from '../dto/user-directory.dto';

export abstract class UserDirectoryDataSource {
  abstract getAll(): Promise<readonly UserDirectoryDto[]>;
}
