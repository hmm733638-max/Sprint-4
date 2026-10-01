import { Inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class GetProductCategoriesUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}
  execute(): Promise<readonly string[]> { return this.products.getCategories(); }
}
