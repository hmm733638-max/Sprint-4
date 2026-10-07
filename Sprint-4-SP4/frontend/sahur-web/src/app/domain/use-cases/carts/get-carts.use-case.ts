import { Inject, Injectable } from '@angular/core';
import { Cart } from '../../entities/cart.entity';
import { CART_REPOSITORY, CartRepository } from '../../repositories/cart.repository';

@Injectable({ providedIn: 'root' })
export class GetCartsUseCase {
  constructor(@Inject(CART_REPOSITORY) private readonly repository: CartRepository) {}
  execute(): Promise<readonly Cart[]> { return this.repository.getAll(); }
}
