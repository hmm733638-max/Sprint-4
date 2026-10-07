import { CartDto } from '../dto/cart.dto';

export abstract class CartDataSource {
  abstract getAll(): Promise<readonly CartDto[]>;
}
