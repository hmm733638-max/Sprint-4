import { AuthenticatedUserDto, LoginRequestDto, LoginResponseDto } from '../dto/auth.dto';

export abstract class AuthDataSource {
  abstract login(credentials: LoginRequestDto): Promise<LoginResponseDto>;
  abstract getCurrentUser(accessToken: string): Promise<AuthenticatedUserDto>;
}
