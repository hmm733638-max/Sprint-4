import { InjectionToken } from '@angular/core';
import { Product } from '../entities/product.entity';

export interface ProductRepository {
  getAll(): Promise<readonly Product[]>;
  getCategories(): Promise<readonly string[]>;
  getByCategory(category: string): Promise<readonly Product[]>;
  getById(id: number): Promise<Product>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');
