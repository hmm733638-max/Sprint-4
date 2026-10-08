export abstract class CartDataSource {
  abstract addItem(productId: number, quantity: number): Promise<void>;

  abstract updateItem(
    productId: number,
    quantity: number
  ): Promise<void>;

  abstract removeItem(productId: number): Promise<void>;
}