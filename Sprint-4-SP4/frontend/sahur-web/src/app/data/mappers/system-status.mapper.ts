import { SystemStatus } from '../../domain/entities/system-status.entity';
import { SystemStatusDto } from '../dto/system-status.dto';

export const mapSystemStatusDto = (dto: SystemStatusDto): SystemStatus => ({
  application: dto.application,
  persistence: dto.persistence,
  databaseAvailable: dto.databaseAvailable
});
