import { Inject, Injectable } from '@angular/core';
import { Product } from '../../entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository
} from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repository: ProductRepository
  ) {}

  execute(id: number): Promise<Product> {
    return this.repository.getById(id);
  }
}
