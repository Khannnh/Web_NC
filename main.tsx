import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Buoi3/app'; // Trỏ đúng vào file App.tsx trong Buoi3

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}