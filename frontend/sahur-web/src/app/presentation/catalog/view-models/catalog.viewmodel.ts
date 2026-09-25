import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../../domain/entities/product.entity';
import { GetProductsUseCase } from '../../../domain/use-cases/products/get-products.use-case';

@Injectable()
export class CatalogViewModel {
  private readonly productsState = signal<readonly Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly products = this.productsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly hasProducts = computed(() => this.productsState().length > 0);

  constructor(private readonly getProducts: GetProductsUseCase) {}

  async load(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      this.productsState.set(await this.getProducts.execute());
    } catch {
      this.errorState.set('No fue posible cargar los productos.');
    } finally {
      this.loadingState.set(false);
    }
  }
}
