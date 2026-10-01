export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly imageUrl: string;
}

export interface ProductUpdate {
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
}
