import { Inject, Injectable } from '@angular/core';

import {
  CART_REPOSITORY,
  CartRepository
} from '../../repositories/cart.repository';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository
  ) {}

  async execute(productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }

    await this.cartRepository.addItem(productId, quantity);
  }
}
