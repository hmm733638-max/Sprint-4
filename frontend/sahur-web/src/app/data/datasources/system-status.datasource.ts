import { SystemStatusDto } from '../dto/system-status.dto';

export abstract class SystemStatusDataSource {
  abstract get(): Promise<SystemStatusDto>;
}
