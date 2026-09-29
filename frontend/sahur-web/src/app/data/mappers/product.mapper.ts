import { Product } from '../../domain/entities/product.entity';
import { ProductDto } from '../dto/product.dto';

export const mapProductDto = (dto: ProductDto): Product => ({
  id: dto.id,
  title: dto.title,
  price: dto.price,
  description: dto.description,
  category: dto.category,
  image: dto.image
});
