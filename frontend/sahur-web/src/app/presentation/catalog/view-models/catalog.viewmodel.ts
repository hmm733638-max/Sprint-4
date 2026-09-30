import { Injectable, computed, inject, signal } from '@angular/core';
import { CatalogNavigationService } from '../../../core/navigation/catalog-navigation.service';
import { Product } from '../../../domain/entities/product.entity';
import { GetProductCategoriesUseCase } from '../../../domain/use-cases/products/get-product-categories.use-case';
import { GetProductsByCategoryUseCase } from '../../../domain/use-cases/products/get-products-by-category.use-case';
import { GetProductsUseCase } from '../../../domain/use-cases/products/get-products.use-case';

@Injectable()
export class CatalogViewModel {
  private readonly getProducts = inject(GetProductsUseCase);
  private readonly getCategories = inject(GetProductCategoriesUseCase);
  private readonly getProductsByCategory = inject(GetProductsByCategoryUseCase);
  private readonly navigation = inject(CatalogNavigationService);

  private readonly productsState = signal<readonly Product[]>([]);
  private readonly categoriesState = signal<readonly string[]>([]);
  private readonly selectedCategoryState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  private readonly categoriesLoadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly categoriesErrorState = signal<string | null>(null);

  readonly products = this.productsState.asReadonly();
  readonly categories = this.categoriesState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly categoriesLoading = this.categoriesLoadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly categoriesError = this.categoriesErrorState.asReadonly();
  readonly hasProducts = computed(() => this.productsState().length > 0);

  async initialize(): Promise<void> {
    await Promise.all([this.loadCategories(), this.loadAll()]);
  }

  async loadAll(): Promise<void> {
    this.selectedCategoryState.set(null);
    await this.loadProducts(() => this.getProducts.execute());
  }

  async selectCategory(category: string): Promise<void> {
    if (category === this.selectedCategoryState()) {
      return;
    }

    this.selectedCategoryState.set(category);
    await this.loadProducts(() => this.getProductsByCategory.execute(category));
  }

  async retry(): Promise<void> {
    const category = this.selectedCategoryState();
    if (category) {
      await this.loadProducts(() => this.getProductsByCategory.execute(category));
      return;
    }

    await this.loadAll();
  }

  async retryCategories(): Promise<void> {
    await this.loadCategories();
  }

  openProduct(productId: number): void {
    void this.navigation.openProduct(productId);
  }

  private async loadCategories(): Promise<void> {
    this.categoriesLoadingState.set(true);
    this.categoriesErrorState.set(null);

    try {
      this.categoriesState.set(await this.getCategories.execute());
    } catch {
      this.categoriesState.set([]);
      this.categoriesErrorState.set('No fue posible cargar las categorías.');
    } finally {
      this.categoriesLoadingState.set(false);
    }
  }

  private async loadProducts(
    request: () => Promise<readonly Product[]>
  ): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    // US04: limpiar el arreglo anterior antes de cambiar de fuente de datos.
    this.productsState.set([]);

    try {
      this.productsState.set(await request());
    } catch {
      this.errorState.set(
        'No fue posible cargar los productos. Revisa tu conexión e inténtalo nuevamente.'
      );
    } finally {
      this.loadingState.set(false);
    }
  }
}
