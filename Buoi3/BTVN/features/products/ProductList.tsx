import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from './productsSlice';
import { addItem } from '../cart/cartSlice';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Đang tải danh sách sản phẩm...</p>;
  if (status === 'failed') return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <div>
      <h3>Danh sách sản phẩm</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((prod) => (
          <div
            key={prod.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              background: '#ffffff',
            }}
          >
            <div>
              <strong>{prod.name}</strong>
              <div style={{ color: '#059669' }}>
                {prod.price.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <button
              onClick={() => dispatch(addItem(prod))}
              style={{
                padding: '6px 12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};