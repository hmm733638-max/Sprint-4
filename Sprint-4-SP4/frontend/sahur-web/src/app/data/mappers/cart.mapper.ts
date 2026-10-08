import { Cart } from '../../domain/entities/cart.entity';
import { CartDto } from '../dto/cart.dto';

export function mapCartDto(dto: CartDto): Cart {
  if (!dto || !Number.isInteger(dto.id) || !Number.isInteger(dto.userId) || !dto.createdOn || !Array.isArray(dto.products)
    || dto.products.some(item => !Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    throw new Error('La respuesta de carritos no tiene el formato esperado.');
  }
  return { id: dto.id, userId: dto.userId, createdOn: dto.createdOn, products: dto.products.map(item => ({ productId: item.productId, quantity: item.quantity })) };
}
