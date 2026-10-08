import { Injectable, signal } from '@angular/core';
import { Cart } from '../../../domain/entities/cart.entity';
import { GetCartsUseCase } from '../../../domain/use-cases/carts/get-carts.use-case';

@Injectable()
export class CartsViewModel {
  private readonly cartsState = signal<readonly Cart[]>([]);
  private readonly expandedCartIdState = signal<number | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  readonly carts = this.cartsState.asReadonly();
  readonly expandedCartId = this.expandedCartIdState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  constructor(private readonly getCarts: GetCartsUseCase) {}

  async initialize(): Promise<void> {
    if (this.loading()) return;
    this.loadingState.set(true); this.errorState.set(null);
    try { this.cartsState.set(await this.getCarts.execute()); }
    catch { this.cartsState.set([]); this.errorState.set('No fue posible cargar el historial de carritos. Revisa la conexión con el servidor.'); }
    finally { this.loadingState.set(false); }
  }

  toggle(cartId: number): void { this.expandedCartIdState.update(current => current === cartId ? null : cartId); }
  retry(): void { void this.initialize(); }
}
