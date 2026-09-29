import { InjectionToken } from '@angular/core';
import { Product } from '../entities/product.entity';

export interface ProductRepository {
  getAll(): Promise<readonly Product[]>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');
