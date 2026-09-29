import { AuthenticatedUser } from '../../entities/authenticated-user.entity';
import { AuthError } from '../../errors/auth.error';
import {
  AuthRepository,
  LoginCredentials
} from '../../repositories/auth.repository';
import { NetworkStatus } from '../../services/network-status';

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly networkStatus: NetworkStatus
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const username = credentials.username.trim();

    if (!username || !credentials.password) {
      throw new AuthError('invalid_input');
    }

    if (!this.networkStatus.isOnline()) {
      throw new AuthError('offline');
    }

    return this.authRepository.login({
      username,
      password: credentials.password
    });
  }
}
