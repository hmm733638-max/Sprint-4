import { UserDirectoryEntry } from '../../domain/entities/user-directory.entity';
import { UserDirectoryDto } from '../dto/user-directory.dto';

export function mapUserDirectoryDto(dto: UserDirectoryDto): UserDirectoryEntry {
  if (!dto || !Number.isInteger(dto.id) || !dto.fullName || !dto.email || !dto.phone || !dto.username || !dto.role) {
    throw new Error('La respuesta de usuarios no tiene el formato esperado.');
  }
  return { id: dto.id, fullName: dto.fullName, email: dto.email, phone: dto.phone, username: dto.username, role: dto.role };
}
