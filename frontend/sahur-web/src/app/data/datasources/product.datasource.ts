import { ProductDto, ProductUpdateDto } from '../dto/product.dto';

export abstract class ProductDataSource {
  abstract getAll(): Promise<readonly ProductDto[]>;
  abstract getCategories(): Promise<readonly string[]>;
  abstract getByCategory(category: string): Promise<readonly ProductDto[]>;
  abstract getById(id: number): Promise<ProductDto>;
  abstract update(id: number, update: ProductUpdateDto): Promise<ProductDto>;
  abstract delete(id: number): Promise<void>;
}
