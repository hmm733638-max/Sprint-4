import { Inject, Injectable } from '@angular/core';
import { Product, ProductUpdate } from '../../entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class UpdateProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}
  execute(id: number, update: ProductUpdate): Promise<Product> { return this.products.update(id, update); }
}
