import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeItem, updateQuantity } from './cartSlice';

export const CartSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity } = useAppSelector((state) => state.cart);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f8fafc',
      }}
    >
      <h3>🛒 Giỏ hàng ({totalQuantity} món)</h3>

      {items.length === 0 ? (
        <p style={{ color: '#64748b' }}>Chưa có sản phẩm nào trong giỏ.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px dashed #cbd5e1',
              }}
            >
              <div>
                <div><strong>{item.name}</strong></div>
                <small style={{ color: '#64748b' }}>
                  {item.price.toLocaleString('vi-VN')} đ
                </small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  style={{ width: '26px', height: '26px' }}
                >
                  -
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  style={{ width: '26px', height: '26px' }}
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                  style={{
                    marginLeft: '8px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <h4>
              Tổng thanh toán:{' '}
              <span style={{ color: '#dc2626' }}>
                {totalPrice.toLocaleString('vi-VN')} đ
              </span>
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};