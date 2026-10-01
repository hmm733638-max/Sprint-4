import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SESSION_REPOSITORY, SessionRepository } from '../../domain/repositories/session.repository';
import { ProductCreateDto, ProductDto, ProductUpdateDto } from '../dto/product.dto';
import { ProductDataSource } from './product.datasource';

@Injectable()
export class HttpProductDataSource extends ProductDataSource {
  constructor(
    private readonly http: HttpClient,
    @Inject(SESSION_REPOSITORY) private readonly session: SessionRepository
  ) { super(); }

  getAll(): Promise<readonly ProductDto[]> {
    return firstValueFrom(this.http.get<ProductDto[]>(`${environment.apiUrl}/products`, this.options()).pipe(timeout(10000)));
  }

  getCategories(): Promise<readonly string[]> {
    return firstValueFrom(this.http.get<string[]>(`${environment.apiUrl}/products/categories`, this.options()).pipe(timeout(10000)));
  }

  getByCategory(category: string): Promise<readonly ProductDto[]> {
    return firstValueFrom(this.http.get<ProductDto[]>(
      `${environment.apiUrl}/products/category/${encodeURIComponent(category)}`,
      this.options()
    ).pipe(timeout(10000)));
  }

  getById(id: number): Promise<ProductDto> {
    return firstValueFrom(this.http.get<ProductDto>(`${environment.apiUrl}/products/${id}`, this.options()).pipe(timeout(10000)));
  }

  create(product: ProductCreateDto): Promise<ProductDto> {
    return firstValueFrom(this.http.post<ProductDto>(`${environment.apiUrl}/products`, product, this.options()).pipe(timeout(10000)));
  }

  update(id: number, update: ProductUpdateDto): Promise<ProductDto> {
    return firstValueFrom(this.http.put<ProductDto>(`${environment.apiUrl}/products/${id}`, update, this.options()).pipe(timeout(10000)));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/products/${id}`, this.options()).pipe(timeout(10000)));
  }

  private options(): { headers: HttpHeaders } {
    const stored = this.session.read();
    return {
      headers: stored
        ? new HttpHeaders({ Authorization: `Bearer ${stored.accessToken}` })
        : new HttpHeaders()
    };
  }
}
