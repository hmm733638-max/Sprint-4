import { Inject, Injectable } from '@angular/core';
import { Product } from '../../entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository
} from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductsByCategoryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repository: ProductRepository
  ) {}

  execute(category: string): Promise<readonly Product[]> {
    return this.repository.getByCategory(category);
  }
}
