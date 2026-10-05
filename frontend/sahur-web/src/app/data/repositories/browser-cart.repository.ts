import { Injectable } from '@angular/core';

import { CartItem } from '../../domain/entities/cart.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class BrowserCartRepository implements CartRepository {
  private readonly items: CartItem[] = [];

  async addItem(productId: number, quantity: number): Promise<void> {
    const existingItem = this.items.find(
      item => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      return;
    }

    this.items.push({
      productId,
      quantity
    });
  }

  async updateItem(productId: number, quantity: number): Promise<void> {
    const existingItem = this.items.find(
      item => item.productId === productId
    );

    if (!existingItem) {
      throw new Error('El producto no existe en el carrito.');
    }

    if (quantity <= 0) {
      await this.removeItem(productId);
      return;
    }

    existingItem.quantity = quantity;
  }

  async removeItem(productId: number): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.productId === productId
    );

    if (itemIndex === -1) {
      return;
    }

    this.items.splice(itemIndex, 1);
  }

  getItems(): readonly CartItem[] {
    return this.items;
  }

  clear(): void {
    this.items.length = 0;
  }
}