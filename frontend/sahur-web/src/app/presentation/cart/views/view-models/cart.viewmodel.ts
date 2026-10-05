import { Injectable, computed, signal } from '@angular/core';

import { CartItem } from '../../../../domain/entities/cart.entity';
import { Product } from '../../../../domain/entities/product.entity';

import {
  CART_REPOSITORY,
  CartRepository
} from '../../../../domain/repositories/cart.repository';

import { GetProductsUseCase } from '../../../../domain/use-cases/products/get-products.use-case';
import { RemoveFromCartUseCase } from '../../../../domain/use-cases/cart/remove-from-cart.use-case';
import { UpdateCartUseCase } from '../../../../domain/use-cases/cart/update-cart.use-case';

import { Inject } from '@angular/core';

export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
  readonly subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartViewModel {
  private readonly itemsState = signal<readonly CartItem[]>([]);
  private readonly productsState = signal<readonly Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly lines = computed<readonly CartLine[]>(() => {
    const products = this.productsState();
    const items = this.itemsState();

    return items
      .map(item => {
        const product = products.find(
          currentProduct => currentProduct.id === item.productId
        );

        if (!product) {
          return null;
        }

        return {
          product,
          quantity: item.quantity,
          subtotal: Number((product.price * item.quantity).toFixed(2))
        };
      })
      .filter((line): line is CartLine => line !== null);
  });

  readonly total = computed(() =>
    Number(
      this.lines()
        .reduce((sum, line) => sum + line.subtotal, 0)
        .toFixed(2)
    )
  );

  readonly isEmpty = computed(() => this.itemsState().length === 0);

  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateCartUseCase: UpdateCartUseCase,
    private readonly removeFromCartUseCase: RemoveFromCartUseCase
  ) {}

  async load(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      this.itemsState.set([...this.cartRepository.getItems()]);
      this.productsState.set(await this.getProductsUseCase.execute());
    } catch (error) {
      this.errorState.set(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar el carrito.'
      );
    } finally {
      this.loadingState.set(false);
    }
  }

  async updateQuantity(
    productId: number,
    quantity: number
  ): Promise<void> {
    this.errorState.set(null);

    try {
      await this.updateCartUseCase.execute(productId, quantity);

      this.itemsState.set([...this.cartRepository.getItems()]);
    } catch (error) {
      this.errorState.set(
        error instanceof Error
          ? error.message
          : 'No fue posible actualizar la cantidad.'
      );
    }
  }

  async removeItem(productId: number): Promise<void> {
    this.errorState.set(null);

    try {
      await this.removeFromCartUseCase.execute(productId);

      this.itemsState.set([...this.cartRepository.getItems()]);
    } catch (error) {
      this.errorState.set(
        error instanceof Error
          ? error.message
          : 'No fue posible eliminar el artículo.'
      );
    }
  }
}