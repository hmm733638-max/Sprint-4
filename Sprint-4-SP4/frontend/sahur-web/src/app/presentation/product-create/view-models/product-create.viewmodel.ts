import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCreate } from '../../../domain/entities/product.entity';
import { CreateProductUseCase } from '../../../domain/use-cases/products/create-product.use-case';

export type ProductCreateField = 'title' | 'price' | 'description' | 'imageUrl' | 'category';

type ProductCreateDraft = Record<ProductCreateField, string>;
type ValidationErrors = Partial<Record<ProductCreateField, string>>;

const emptyDraft = (): ProductCreateDraft => ({
  title: '',
  price: '',
  description: '',
  imageUrl: '',
  category: ''
});

@Injectable()
export class ProductCreateViewModel {
  private readonly draftState = signal<ProductCreateDraft>(emptyDraft());
  private readonly validationErrorsState = signal<ValidationErrors>({});
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly successState = signal<string | null>(null);

  readonly draft = this.draftState.asReadonly();
  readonly validationErrors = this.validationErrorsState.asReadonly();
  readonly saving = this.savingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly success = this.successState.asReadonly();

  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly router: Router
  ) {}

  updateField(field: ProductCreateField, value: string): void {
    this.draftState.update(current => ({ ...current, [field]: value }));
    if (this.validationErrors()[field]) {
      this.validationErrorsState.update(current => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    this.errorState.set(null);
    this.successState.set(null);
  }

  fieldError(field: ProductCreateField): string | null {
    return this.validationErrors()[field] ?? null;
  }

  async submit(): Promise<void> {
    if (this.saving()) return;

    const draft = this.draft();
    const errors = this.validate(draft);
    this.validationErrorsState.set(errors);
    this.errorState.set(null);
    this.successState.set(null);

    if (Object.keys(errors).length > 0) return;

    const product: ProductCreate = {
      title: draft.title.trim(),
      price: Number(draft.price),
      description: draft.description.trim(),
      imageUrl: draft.imageUrl.trim(),
      category: draft.category.trim()
    };

    this.savingState.set(true);
    try {
      const created = await this.createProduct.execute(product);
      this.draftState.set(emptyDraft());
      this.validationErrorsState.set({});
      this.successState.set(`Producto registrado correctamente. Nuevo ID: ${created.id}.`);
    } catch {
      this.errorState.set('No fue posible registrar el producto. Revisa los datos e inténtalo nuevamente.');
    } finally {
      this.savingState.set(false);
    }
  }

  backToCatalog(): void {
    void this.router.navigateByUrl('/inicio');
  }

  private validate(draft: ProductCreateDraft): ValidationErrors {
    const errors: ValidationErrors = {};
    const price = Number(draft.price);

    if (!draft.title.trim()) errors.title = 'El título es obligatorio.';
    if (!draft.price.trim() || !Number.isFinite(price) || price <= 0) {
      errors.price = 'Ingresa un precio numérico mayor que cero.';
    }
    if (!draft.description.trim()) errors.description = 'La descripción es obligatoria.';
    if (!draft.category.trim()) errors.category = 'La categoría es obligatoria.';

    const imageUrl = draft.imageUrl.trim();
    if (!imageUrl) {
      errors.imageUrl = 'La URL de imagen es obligatoria.';
    } else if (!this.isValidHttpUrl(imageUrl)) {
      errors.imageUrl = 'Ingresa una URL válida que comience con http:// o https://.';
    }

    return errors;
  }

  private isValidHttpUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
