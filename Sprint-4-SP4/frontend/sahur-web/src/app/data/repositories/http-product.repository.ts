import { Injectable } from '@angular/core';
import { Product, ProductCreate, ProductUpdate } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductDataSource } from '../datasources/product.datasource';
import { mapProductCreate, mapProductDto, mapProductUpdate } from '../mappers/product.mapper';

@Injectable()
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly dataSource: ProductDataSource) {}

  async getAll(): Promise<readonly Product[]> {
    return (await this.dataSource.getAll()).map(mapProductDto);
  }

  getCategories(): Promise<readonly string[]> {
    return this.dataSource.getCategories();
  }

  async getByCategory(category: string): Promise<readonly Product[]> {
    return (await this.dataSource.getByCategory(category)).map(mapProductDto);
  }

  async getById(id: number): Promise<Product> {
    return mapProductDto(await this.dataSource.getById(id));
  }

  async create(product: ProductCreate): Promise<Product> {
    return mapProductDto(await this.dataSource.create(mapProductCreate(product)));
  }

  async update(id: number, update: ProductUpdate): Promise<Product> {
    return mapProductDto(await this.dataSource.update(id, mapProductUpdate(update)));
  }

  delete(id: number): Promise<void> {
    return this.dataSource.delete(id);
  }
}
