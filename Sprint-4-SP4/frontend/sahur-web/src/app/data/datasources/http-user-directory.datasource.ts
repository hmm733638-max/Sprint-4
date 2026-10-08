import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SESSION_REPOSITORY, SessionRepository } from '../../domain/repositories/session.repository';
import { UserDirectoryDto } from '../dto/user-directory.dto';
import { UserDirectoryDataSource } from './user-directory.datasource';

@Injectable()
export class HttpUserDirectoryDataSource extends UserDirectoryDataSource {
  constructor(private readonly http: HttpClient, @Inject(SESSION_REPOSITORY) private readonly session: SessionRepository) { super(); }

  getAll(): Promise<readonly UserDirectoryDto[]> {
    return firstValueFrom(this.http.get<UserDirectoryDto[]>(`${environment.apiUrl}/users`, { headers: this.headers() }).pipe(timeout(10000)));
  }

  private headers(): HttpHeaders {
    const stored = this.session.read();
    return stored ? new HttpHeaders({ Authorization: `Bearer ${stored.accessToken}` }) : new HttpHeaders();
  }
}
