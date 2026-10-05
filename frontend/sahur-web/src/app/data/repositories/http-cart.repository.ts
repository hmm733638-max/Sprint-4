import { Injectable } from '@angular/core';

import { CartItem } from '../../domain/entities/cart.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartDataSource } from '../datasources/cart.datasource';
import { BrowserCartRepository } from './browser-cart.repository';

@Injectable()
export class HttpCartRepository implements CartRepository {
  constructor(
    private readonly dataSource: CartDataSource,
    private readonly browserCartRepository: BrowserCartRepository
  ) {}

  async addItem(productId: number, quantity: number): Promise<void> {
    await this.dataSource.addItem(productId, quantity);
    await this.browserCartRepository.addItem(productId, quantity);
  }

  async updateItem(productId: number, quantity: number): Promise<void> {
    await this.dataSource.updateItem(productId, quantity);
    await this.browserCartRepository.updateItem(productId, quantity);
  }

  async removeItem(productId: number): Promise<void> {
    await this.dataSource.removeItem(productId);
    await this.browserCartRepository.removeItem(productId);
  }

  getItems(): readonly CartItem[] {
    return this.browserCartRepository.getItems();
  }

  clear(): void {
    this.browserCartRepository.clear();
  }
}