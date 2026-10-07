import { InjectionToken } from '@angular/core';
import { Cart } from '../entities/cart.entity';

export interface CartRepository {
  getAll(): Promise<readonly Cart[]>;
}

export const CART_REPOSITORY = new InjectionToken<CartRepository>('CartRepository');
