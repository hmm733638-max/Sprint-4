import { Inject, Injectable } from '@angular/core';
import { Product } from '../../entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductsUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}
  execute(): Promise<readonly Product[]> { return this.products.getAll(); }
}
