import { Injectable } from '@angular/core';
import { Cart } from '../../domain/entities/cart.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { CartDataSource } from '../datasources/cart.datasource';
import { mapCartDto } from '../mappers/cart.mapper';

@Injectable()
export class HttpCartRepository implements CartRepository {
  constructor(private readonly dataSource: CartDataSource) {}
  async getAll(): Promise<readonly Cart[]> { return (await this.dataSource.getAll()).map(mapCartDto); }
}
