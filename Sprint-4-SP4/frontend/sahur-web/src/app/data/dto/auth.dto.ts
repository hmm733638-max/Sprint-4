export interface AuthenticatedUserDto {
  id: number;
  username: string;
  role: string;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: AuthenticatedUserDto;
}
