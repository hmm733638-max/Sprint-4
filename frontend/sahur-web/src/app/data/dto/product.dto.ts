export interface ProductDto {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly imageUrl: string;
}

export interface ProductCreateDto {
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly category: string;
}

export interface ProductUpdateDto {
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
}
