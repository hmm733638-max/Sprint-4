import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticatedUserDto, LoginRequestDto, LoginResponseDto } from '../dto/auth.dto';
import { AuthDataSource } from './auth.datasource';

@Injectable()
export class HttpAuthDataSource extends AuthDataSource {
  constructor(private readonly http: HttpClient) { super(); }

  login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    return firstValueFrom(this.http.post<LoginResponseDto>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(timeout(10000)));
  }

  getCurrentUser(accessToken: string): Promise<AuthenticatedUserDto> {
    return firstValueFrom(this.http.get<AuthenticatedUserDto>(`${environment.apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).pipe(timeout(10000)));
  }
}
