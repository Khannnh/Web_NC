import React from "react";
import { Product } from "./type";
import { usePagination } from "./hook/usePagination";
import { Accordion } from "./components/Accordion";

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Bàn phím cơ Aula F75", price: 1250000, category: "Bàn phím", description: "Layout 75%, mạch xuôi, lót foam poron tiêu âm.", stock: 15 },
  { id: "p2", name: "Chuột Dragonfly F1 Pro", price: 950000, category: "Chuột", description: "Mắt đọc PAW3395 26000 DPI, trọng lượng nhẹ 49g.", stock: 20 },
  { id: "p3", name: "Màn hình ViewSonic 27 inch 2K", price: 4800000, category: "Màn hình", description: "Tấm nền Fast IPS 170Hz, độ phủ màu 99% sRGB.", stock: 8 },
  { id: "p4", name: "Tai nghe chống ồn Sony CH720N", price: 1950000, category: "Âm thanh", description: "Chống ồn chủ động ANC băng thông rộng, pin 50 giờ.", stock: 12 },
  { id: "p5", name: "Giá treo màn hình North Bayou", price: 350000, category: "Phụ kiện", description: "Xi lanh piston trợ lực gas strut tải trọng đến 9kg.", stock: 35 },
];

export default function ProductListApp() {
  const {
    currentPage,
    totalPages,
    currentData: pagedProducts,
    nextPage,
    prevPage,
    goToPage,
    canNextPage,
    canPrevPage,
  } = usePagination<Product>({
    data: MOCK_PRODUCTS,
    itemsPerPage: 2, // 2 sản phẩm mỗi trang
  });

  return (
    <div style={{ maxWidth: "640px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#0f172a", marginBottom: "8px" }}>Danh Mục Sản Phẩm</h2>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Trang {currentPage} / {totalPages} (Hiển thị 2 sản phẩm/trang)
      </p>

      {/* Accordion chỉ mở duy nhất 1 panel */}
      <Accordion defaultActiveId="p1">
        {pagedProducts.map((product) => (
          <Accordion.Item key={product.id} id={product.id}>
            <Accordion.Header>
              <span>{product.name}</span>
              <span style={{ color: "#059669", fontWeight: 700 }}>
                {product.price.toLocaleString("vi-VN")} đ
              </span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ margin: "4px 0" }}><strong>Phân loại:</strong> {product.category}</p>
              <p style={{ margin: "4px 0" }}><strong>Tồn kho:</strong> {product.stock} sản phẩm</p>
              <p style={{ margin: "8px 0 0 0" }}><strong>Mô tả:</strong> {product.description}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Cụm điều khiển phân trang */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "20px" }}>
        <button
          onClick={prevPage}
          disabled={!canPrevPage}
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            backgroundColor: canPrevPage ? "#fff" : "#f1f5f9",
            color: canPrevPage ? "#1e293b" : "#94a3b8",
            cursor: canPrevPage ? "pointer" : "not-allowed",
          }}
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNum = index + 1;
          const isCurrent = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              style={{
                padding: "8px 14px",
                border: isCurrent ? "1px solid #2563eb" : "1px solid #cbd5e1",
                borderRadius: "6px",
                backgroundColor: isCurrent ? "#2563eb" : "#ffffff",
                color: isCurrent ? "#ffffff" : "#1e293b",
                fontWeight: isCurrent ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={nextPage}
          disabled={!canNextPage}
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            backgroundColor: canNextPage ? "#fff" : "#f1f5f9",
            color: canNextPage ? "#1e293b" : "#94a3b8",
            cursor: canNextPage ? "pointer" : "not-allowed",
          }}
        >
          Sau
        </button>
      </div>
    </div>
  );
}