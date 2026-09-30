import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductDto } from '../dto/product.dto';
import { mapProductDto } from '../mappers/product.mapper';

@Injectable()
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly http: HttpClient) {}

  async getAll(): Promise<readonly Product[]> {
    const dtos = await firstValueFrom(
      this.http.get<ProductDto[]>(`${environment.apiUrl}/products`)
    );
    return dtos.map(mapProductDto);
  }

  getCategories(): Promise<readonly string[]> {
    return firstValueFrom(
      this.http.get<string[]>(`${environment.apiUrl}/products/categories`)
    );
  }

  async getByCategory(category: string): Promise<readonly Product[]> {
    const encodedCategory = encodeURIComponent(category);
    const dtos = await firstValueFrom(
      this.http.get<ProductDto[]>(
        `${environment.apiUrl}/products/category/${encodedCategory}`
      )
    );
    return dtos.map(mapProductDto);
  }

  async getById(id: number): Promise<Product> {
    const dto = await firstValueFrom(
      this.http.get<ProductDto>(`${environment.apiUrl}/products/${id}`)
    );
    return mapProductDto(dto);
  }
}
