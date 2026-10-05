import { Inject, Injectable } from '@angular/core';

import {
  CART_REPOSITORY,
  CartRepository
} from '../../repositories/cart.repository';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository
  ) {}

  async execute(productId: number): Promise<void> {
    await this.cartRepository.removeItem(productId);
  }
}