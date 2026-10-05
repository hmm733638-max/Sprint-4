import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  SESSION_REPOSITORY,
  SessionRepository
} from '../../domain/repositories/session.repository';

import { CartDataSource } from './cart.datasource';

@Injectable()
export class HttpCartDataSource extends CartDataSource {
  constructor(
    private readonly http: HttpClient,
    @Inject(SESSION_REPOSITORY)
    private readonly session: SessionRepository
  ) {
    super();
  }

  async addItem(productId: number, quantity: number): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(
          `${environment.apiUrl}/carts`,
          {
            productId,
            quantity
          },
          this.options()
        )
        .pipe(timeout(10000))
    );
  }

  async updateItem(productId: number, quantity: number): Promise<void> {
    await firstValueFrom(
      this.http
        .put<void>(
          `${environment.apiUrl}/carts/${productId}`,
          {
            quantity
          },
          this.options()
        )
        .pipe(timeout(10000))
    );
  }

  async removeItem(productId: number): Promise<void> {
    await firstValueFrom(
      this.http
        .delete<void>(
          `${environment.apiUrl}/carts/${productId}`,
          this.options()
        )
        .pipe(timeout(10000))
    );
  }

  private options(): { headers: HttpHeaders } {
    const stored = this.session.read();

    return {
      headers: stored
        ? new HttpHeaders({
            Authorization: `Bearer ${stored.accessToken}`
          })
        : new HttpHeaders()
    };
  }
}