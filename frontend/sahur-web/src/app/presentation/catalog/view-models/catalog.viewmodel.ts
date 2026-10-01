import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../domain/entities/product.entity';
import { GetProductCategoriesUseCase } from '../../../domain/use-cases/products/get-product-categories.use-case';
import { GetProductsByCategoryUseCase } from '../../../domain/use-cases/products/get-products-by-category.use-case';
import { GetProductsUseCase } from '../../../domain/use-cases/products/get-products.use-case';

@Injectable()
export class CatalogViewModel {
  private readonly productsState = signal<readonly Product[]>([]);
  private readonly categoriesState = signal<readonly string[]>([]);
  private readonly selectedCategoryState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly products = this.productsState.asReadonly();
  readonly categories = this.categoriesState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor(
    private readonly getProducts: GetProductsUseCase,
    private readonly getCategories: GetProductCategoriesUseCase,
    private readonly getProductsByCategory: GetProductsByCategoryUseCase,
    private readonly router: Router
  ) {}

  async initialize(): Promise<void> {
    if (this.loading()) return;
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      const [products, categories] = await Promise.all([
        this.getProducts.execute(),
        this.getCategories.execute()
      ]);
      this.productsState.set(products);
      this.categoriesState.set(categories);
      this.selectedCategoryState.set(null);
    } catch {
      this.productsState.set([]);
      this.errorState.set('No fue posible cargar el catálogo. Revisa la conexión con el servidor.');
    } finally {
      this.loadingState.set(false);
    }
  }

  async selectCategory(category: string | null): Promise<void> {
    if (this.loading() || this.selectedCategory() === category) return;

    this.productsState.set([]);
    this.selectedCategoryState.set(category);
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const products = category
        ? await this.getProductsByCategory.execute(category)
        : await this.getProducts.execute();
      this.productsState.set(products);
    } catch {
      this.errorState.set('No fue posible actualizar el catálogo. Inténtalo nuevamente.');
    } finally {
      this.loadingState.set(false);
    }
  }

  retry(): void {
    if (this.selectedCategory()) {
      const category = this.selectedCategory();
      this.selectedCategoryState.set(null);
      void this.selectCategory(category);
      return;
    }
    void this.initialize();
  }

  openProduct(productId: number): void {
    void this.router.navigate(['/productos', productId]);
  }
}
