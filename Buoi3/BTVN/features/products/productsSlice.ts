import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../products/type';

// Dữ liệu API giả lập
const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Bàn phím cơ Aula F75', price: 1250000 },
  { id: 'p2', name: 'Chuột Dragonfly F1 Pro', price: 950000 },
  { id: 'p3', name: 'Màn hình Gaming 27 inch 2K', price: 4500000 },
  { id: 'p4', name: 'Tai nghe chụp tai Sony CH720N', price: 1850000 },
];

// Giả lập fetch API có độ trễ 500ms
export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchAll',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PRODUCTS;
  }
);

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Lỗi tải dữ liệu';
      });
  },
});

export default productsSlice.reducer;