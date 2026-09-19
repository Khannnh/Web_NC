import React from 'react';
import { Provider } from 'react-redux';
import { store } from './BTVN/app/store';
import { ProductList } from './BTVN/features/products/ProductList';
import { CartSummary } from './BTVN/features/cart/cartSummary';

export default function App() {
  return (
    <Provider store={store}>
      <div
        style={{
          maxWidth: '850px',
          margin: '30px auto',
          fontFamily: 'Arial, sans-serif',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <ProductList />
        <CartSummary />
      </div>
    </Provider>
  );
}