import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SESSION_REPOSITORY, SessionRepository } from '../../domain/repositories/session.repository';
import { CartDto } from '../dto/cart.dto';
import { CartDataSource } from './cart.datasource';

@Injectable()
export class HttpCartDataSource extends CartDataSource {
  constructor(private readonly http: HttpClient, @Inject(SESSION_REPOSITORY) private readonly session: SessionRepository) { super(); }

  getAll(): Promise<readonly CartDto[]> {
    return firstValueFrom(this.http.get<CartDto[]>(`${environment.apiUrl}/carts`, { headers: this.headers() }).pipe(timeout(10000)));
  }

  private headers(): HttpHeaders {
    const stored = this.session.read();
    return stored ? new HttpHeaders({ Authorization: `Bearer ${stored.accessToken}` }) : new HttpHeaders();
  }
}
