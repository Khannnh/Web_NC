import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../cart/type';
import { Product } from '../products/type';

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm sản phẩm vào giỏ
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalQuantity += 1;
    },

    // 2. Xoá sản phẩm khỏi giỏ
    removeItem(state, action: PayloadAction<string>) {
      const existing = state.items.find((item) => item.id === action.payload);
      if (existing) {
        state.totalQuantity -= existing.quantity;
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },

    // 3. Cập nhật số lượng
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        const diff = action.payload.quantity - item.quantity;
        if (action.payload.quantity <= 0) {
          state.totalQuantity -= item.quantity;
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
          state.totalQuantity += diff;
        }
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;