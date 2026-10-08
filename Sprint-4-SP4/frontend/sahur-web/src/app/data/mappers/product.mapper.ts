import { environment } from '../../../environments/environment';
import { Product, ProductCreate, ProductUpdate } from '../../domain/entities/product.entity';
import { ProductCreateDto, ProductDto, ProductUpdateDto } from '../dto/product.dto';

export const mapProductDto = (dto: ProductDto): Product => ({
  id: dto.id,
  title: dto.title,
  price: dto.price,
  description: dto.description,
  category: dto.category,
  imageUrl: dto.imageUrl.startsWith('http')
    ? dto.imageUrl
    : `${environment.apiOrigin}${dto.imageUrl}`
});

export const mapProductCreate = (product: ProductCreate): ProductCreateDto => ({
  title: product.title,
  price: product.price,
  description: product.description,
  imageUrl: product.imageUrl,
  category: product.category
});

export const mapProductUpdate = (update: ProductUpdate): ProductUpdateDto => ({
  title: update.title,
  price: update.price,
  description: update.description,
  category: update.category
});
