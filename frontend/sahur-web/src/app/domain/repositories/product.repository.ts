import { InjectionToken } from '@angular/core';
import { Product, ProductCreate, ProductUpdate } from '../entities/product.entity';

export interface ProductRepository {
  getAll(): Promise<readonly Product[]>;
  getCategories(): Promise<readonly string[]>;
  getByCategory(category: string): Promise<readonly Product[]>;
  getById(id: number): Promise<Product>;
  create(product: ProductCreate): Promise<Product>;
  update(id: number, update: ProductUpdate): Promise<Product>;
  delete(id: number): Promise<void>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');
