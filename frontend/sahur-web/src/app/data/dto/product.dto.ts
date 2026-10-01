export interface ProductDto {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly imageUrl: string;
}

export interface ProductUpdateDto {
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
}
