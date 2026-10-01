import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductUpdate } from '../../../domain/entities/product.entity';
import { DeleteProductUseCase } from '../../../domain/use-cases/products/delete-product.use-case';
import { GetProductByIdUseCase } from '../../../domain/use-cases/products/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../../domain/use-cases/products/update-product.use-case';
import { SessionViewModel } from '../../auth/view-models/session.viewmodel';

interface ProductDraft {
  readonly title: string;
  readonly price: string;
  readonly description: string;
  readonly category: string;
}

@Injectable()
export class ProductDetailViewModel {
  private readonly productState = signal<Product | null>(null);
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly editModeState = signal(false);
  private readonly deleteConfirmationState = signal(false);
  private readonly draftState = signal<ProductDraft>({ title: '', price: '', description: '', category: '' });

  readonly product = this.productState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly saving = this.savingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly editMode = this.editModeState.asReadonly();
  readonly deleteConfirmation = this.deleteConfirmationState.asReadonly();
  readonly draft = this.draftState.asReadonly();
  readonly isAdministrator = computed(() => this.session.user()?.role === 'Administrador');

  constructor(
    private readonly getProductById: GetProductByIdUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly session: SessionViewModel,
    private readonly router: Router
  ) {}

  async load(productId: number): Promise<void> {
    if (!Number.isInteger(productId) || productId <= 0) {
      this.handleUnavailable();
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.productState.set(null);
    try {
      const product = await this.getProductById.execute(productId);
      this.productState.set(product);
      this.setDraft(product);
    } catch {
      this.handleUnavailable();
    } finally {
      this.loadingState.set(false);
    }
  }

  backToCatalog(): void {
    void this.router.navigateByUrl('/inicio');
  }

  startEdit(): void {
    const product = this.product();
    if (!this.isAdministrator() || !product) return;
    this.setDraft(product);
    this.deleteConfirmationState.set(false);
    this.errorState.set(null);
    this.editModeState.set(true);
  }

  cancelEdit(): void {
    this.editModeState.set(false);
    const product = this.product();
    if (product) this.setDraft(product);
  }

  updateDraft(field: keyof ProductDraft, value: string): void {
    this.draftState.update(current => ({ ...current, [field]: value }));
  }

  async saveEdit(): Promise<void> {
    const product = this.product();
    if (!this.isAdministrator() || !product || this.saving()) return;

    const draft = this.draft();
    const price = Number(draft.price);
    if (!draft.title.trim() || !draft.description.trim() || !draft.category.trim() || !Number.isFinite(price) || price <= 0) {
      this.errorState.set('Completa correctamente título, precio, descripción y categoría.');
      return;
    }

    const update: ProductUpdate = {
      title: draft.title.trim(),
      price,
      description: draft.description.trim(),
      category: draft.category.trim()
    };

    this.savingState.set(true);
    this.errorState.set(null);
    try {
      const updated = await this.updateProduct.execute(product.id, update);
      this.productState.set(updated);
      this.setDraft(updated);
      this.editModeState.set(false);
    } catch {
      this.errorState.set('No fue posible guardar los cambios del producto.');
    } finally {
      this.savingState.set(false);
    }
  }

  requestDelete(): void {
    if (!this.isAdministrator()) return;
    this.editModeState.set(false);
    this.deleteConfirmationState.set(true);
    this.errorState.set(null);
  }

  cancelDelete(): void {
    this.deleteConfirmationState.set(false);
  }

  async confirmDelete(): Promise<void> {
    const product = this.product();
    if (!this.isAdministrator() || !product || this.saving()) return;

    this.savingState.set(true);
    this.errorState.set(null);
    try {
      await this.deleteProduct.execute(product.id);
      await this.router.navigateByUrl('/inicio');
    } catch {
      this.errorState.set('No fue posible eliminar el producto.');
      this.deleteConfirmationState.set(false);
    } finally {
      this.savingState.set(false);
    }
  }

  private setDraft(product: Product): void {
    this.draftState.set({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      category: product.category
    });
  }

  private handleUnavailable(): void {
    this.productState.set(null);
    this.errorState.set('Producto no disponible');
    window.setTimeout(() => void this.router.navigateByUrl('/inicio'), 1400);
  }
}
