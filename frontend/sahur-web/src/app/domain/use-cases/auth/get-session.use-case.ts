import { AuthenticatedUser } from '../../entities/authenticated-user.entity';
import { AuthError } from '../../errors/auth.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { NetworkStatus } from '../../services/network-status';

export class GetSessionUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly network: NetworkStatus
  ) {}

  execute(): Promise<AuthenticatedUser | null> {
    if (!this.network.isOnline()) {
      return Promise.reject(new AuthError('offline'));
    }

    return this.repository.getSession();
  }
}
