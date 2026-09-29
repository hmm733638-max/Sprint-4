import { AuthError } from '../../errors/auth.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { NetworkStatus } from '../../services/network-status';

export class LogoutUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly network: NetworkStatus
  ) {}

  async execute(): Promise<void> {
    if (!this.network.isOnline()) {
      throw new AuthError('offline');
    }

    await this.repository.logout();
  }
}
