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
    const dtos = await firstValueFrom(this.http.get<ProductDto[]>(`${environment.apiUrl}/products`));
    return dtos.map(mapProductDto);
  }
}
