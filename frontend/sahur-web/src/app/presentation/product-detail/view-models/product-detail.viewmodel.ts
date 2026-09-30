import { Injectable, computed, inject, signal } from '@angular/core';
import { CatalogNavigationService } from '../../../core/navigation/catalog-navigation.service';
import { SessionStore } from '../../../core/session/session.store';
import { Product } from '../../../domain/entities/product.entity';
import { GetProductByIdUseCase } from '../../../domain/use-cases/products/get-product-by-id.use-case';

type ManagementAction = 'edit' | 'delete' | null;

@Injectable()
export class ProductDetailViewModel {
  private readonly getProductById = inject(GetProductByIdUseCase);
  private readonly session = inject(SessionStore);
  private readonly navigation = inject(CatalogNavigationService);

  private readonly productState = signal<Product | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly managementActionState = signal<ManagementAction>(null);

  readonly product = this.productState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly managementAction = this.managementActionState.asReadonly();
  readonly isAdministrator = computed(
    () => this.session.user()?.role === 'Administrador'
  );

  async load(productId: number): Promise<void> {
    if (!Number.isInteger(productId) || productId <= 0) {
      this.handleUnavailable();
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.productState.set(null);

    try {
      this.productState.set(await this.getProductById.execute(productId));
    } catch {
      this.handleUnavailable();
    } finally {
      this.loadingState.set(false);
    }
  }

  backToCatalog(): void {
    void this.navigation.backToCatalog();
  }

  requestEdit(): void {
    if (!this.isAdministrator()) {
      return;
    }

    this.managementActionState.set('edit');
  }

  requestDelete(): void {
    if (!this.isAdministrator()) {
      return;
    }

    this.managementActionState.set('delete');
  }

  clearManagementAction(): void {
    this.managementActionState.set(null);
  }

  private handleUnavailable(): void {
    this.productState.set(null);
    this.errorState.set('Producto no disponible');

    window.setTimeout(() => {
      void this.navigation.backToCatalog();
    }, 1400);
  }
}
