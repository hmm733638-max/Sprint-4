import { Inject, Injectable } from '@angular/core';

import {
  CART_REPOSITORY,
  CartRepository
} from '../../repositories/cart.repository';

@Injectable()
export class UpdateCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository
  ) {}

  async execute(productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.cartRepository.removeItem(productId);
      return;
    }

    await this.cartRepository.updateItem(productId, quantity);
  }
}