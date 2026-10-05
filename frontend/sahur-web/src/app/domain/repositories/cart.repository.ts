import { InjectionToken } from '@angular/core';

import { CartItem } from '../entities/cart.entity';

export interface CartRepository {
  addItem(productId: number, quantity: number): Promise<void>;
  updateItem(productId: number, quantity: number): Promise<void>;
  removeItem(productId: number): Promise<void>;
  getItems(): readonly CartItem[];
  clear(): void;
}

export const CART_REPOSITORY = new InjectionToken<CartRepository>(
  'CartRepository'
);