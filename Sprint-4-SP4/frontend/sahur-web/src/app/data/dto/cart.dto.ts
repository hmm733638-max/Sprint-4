export interface CartItemDto { productId: number; quantity: number; }
export interface CartDto { id: number; userId: number; createdOn: string; products: CartItemDto[]; }
