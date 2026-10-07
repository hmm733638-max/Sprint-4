import { Inject, Injectable } from '@angular/core';
import { Product, ProductCreate } from '../../entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}

  execute(product: ProductCreate): Promise<Product> {
    return this.products.create(product);
  }
}
