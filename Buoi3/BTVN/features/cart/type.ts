import { Product } from '../products/type';
export interface CartItem extends Product {
  quantity: number;
}
export interface CartState {
    items: CartItem[];
    totalQuantity: number;
}