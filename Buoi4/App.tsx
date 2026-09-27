import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

// 1. Dùng Store và Actions của Redux (Buổi 3)
import { store } from '../Buoi3/BTVN/app/store';
import { useAppDispatch, useAppSelector } from '../Buoi3/BTVN/app/hooks';
import { fetchProducts } from '../Buoi3/BTVN/features/products/productsSlice';
import { addItem } from '../Buoi3/BTVN/features/cart/cartSlice';
import { CartSummary } from '../Buoi3/BTVN/features/cart/CartSummary';

// 2. Dùng Zustand Store (Buổi 4)
import { useFavoritesStore } from './favoritesStore';

// Component Danh sách sản phẩm: CÓ CẢ NÚT REDUX LẪN NÚT TIM ZUSTAND
function ProductListWithFavorites() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>⏳ Đang tải sản phẩm...</p>;

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ marginTop: 0 }}>📦 Danh sách sản phẩm</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((p) => {
          const favorite = isFavorite(p.id);
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <strong>{p.name}</strong>
                <div style={{ color: '#059669', marginTop: '4px' }}>
                  {p.price.toLocaleString('vi-VN')} đ
                </div>
              </div>

              {/* KHU VỰC 2 NÚT THAO TÁC */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Nút Thêm vào giỏ (chạy Redux Toolkit) */}
                <button
                  onClick={() => dispatch(addItem(p))}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Thêm vào giỏ
                </button>

                {/* Nút Thả tim / Bỏ thích (chạy Zustand) */}
                <button
                  onClick={() => toggleFavorite(p)}
                  title={favorite ? 'Bỏ thích' : 'Yêu thích'}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #cbd5e1',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: favorite ? '#fee2e2' : '#f8fafc',
                    fontSize: '14px',
                  }}
                >
                  {favorite ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component Danh sách Yêu thích của Zustand
function FavoritesSummary() {
  const { favorites, toggleFavorite } = useFavoritesStore();

  return (
    <div
      style={{
        border: '1px solid #fecdd3',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#fff1f2',
        marginTop: '20px',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#be123c' }}>
        ❤️ Danh sách yêu thích ({favorites.length})
      </h3>
      {favorites.length === 0 ? (
        <p style={{ color: '#881337', margin: 0 }}>Chưa có sản phẩm nào được thả tim.</p>
      ) : (
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {favorites.map((item) => (
            <li key={item.id} style={{ marginBottom: '6px' }}>
              <strong>{item.name}</strong> - {item.price.toLocaleString('vi-VN')} đ
              <button
                onClick={() => toggleFavorite(item)}
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: '#e11d48',
                }}
              >
                ✖ Bỏ thích
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// App tổng hợp
export default function App() {
  return (
    <Provider store={store}>
      <div style={{ maxWidth: '900px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
        <h2>Tích hợp: Redux Toolkit (Buổi 3) + Zustand (Buổi 4)</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Cột 1: Danh sách SP có cả 2 nút bấm */}
          <div>
            <ProductListWithFavorites />
          </div>

          {/* Cột 2: Giỏ hàng Redux + Khung Yêu thích Zustand */}
          <div>
            <CartSummary />
            <FavoritesSummary />
          </div>
        </div>

        {/* 5 dòng nhận xét nộp bài */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>Nhận xét so sánh Zustand với Redux Toolkit (5 dòng):</h4>
          <p style={{ lineHeight: '1.6', margin: 0, color: '#1e293b' }}>
            1. Zustand không yêu cầu bọc thẻ Provider quanh ứng dụng như Redux Toolkit, giúp cây component gọn gàng hơn[cite: 9].<br />
            2. Toàn bộ state và action được khai báo trực tiếp trong một hook duy nhất, loại bỏ nhiều boilerplate code (slice, action creator)[cite: 9, 10].<br />
            3. Hiệu năng được tối ưu thông qua selector linh hoạt, chỉ re-render những component thực sự đọc dữ liệu thay đổi[cite: 9, 10].<br />
            4. Điểm hạn chế của Zustand so với Redux Toolkit là không có cơ chế chuẩn hóa 3 trạng thái pending/fulfilled/rejected tự động khi gọi API bất đồng bộ[cite: 9].<br />
            5. Với các nghiệp vụ nhỏ độc lập (như danh sách Yêu thích), Zustand triển khai nhanh hơn hẳn mà không làm cồng kềnh thêm Redux Store chính[cite: 9, 10].
          </p>
        </div>
      </div>
    </Provider>
  );
}