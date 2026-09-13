import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

// ============================================================================
// PHẦN 1: CUSTOM HOOK usePagination<T> (Generic Type)
// ============================================================================

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

export function usePagination<T>({
  data,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Tính tổng số trang (tối thiểu là 1 trang)
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  // Điều chỉnh trang hiện tại nếu dữ liệu thay đổi khiến trang vượt ngưỡng
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Cắt mảng dữ liệu cho trang hiện tại
  const currentData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, safeCurrentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage: safeCurrentPage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    canNextPage: safeCurrentPage < totalPages,
    canPrevPage: safeCurrentPage > 1,
  };
}

// ============================================================================
// PHẦN 2: COMPOUND COMPONENT ACCORDION (Context API)
// ============================================================================

// 1. Khởi tạo Context cho Accordion
interface AccordionContextType {
  activeId: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion compound components must be rendered inside an Accordion parent");
  }
  return context;
};

// 2. Component Accordion chính (Container)
interface AccordionProps {
  children: ReactNode;
  defaultActiveId?: string | null;
}

export const Accordion = ({ children, defaultActiveId = null }: AccordionProps) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  // Logic: Nếu bấm vào panel đang mở thì đóng lại, bấm cái khác thì mở cái mới và đóng cái cũ
  const toggleItem = (id: string) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem }}>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Context phụ cho từng AccordionItem
interface AccordionItemContextType {
  id: string;
}
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

// 3. Component Accordion.Item
interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

const AccordionItem = ({ id, children }: AccordionItemProps) => {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div style={{ borderBottom: "1px solid #e2e8f0" }}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

// 4. Component Accordion.Header
interface AccordionHeaderProps {
  children: ReactNode;
}

const AccordionHeader = ({ children }: AccordionHeaderProps) => {
  const { activeId, toggleItem } = useAccordionContext();
  const itemContext = useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error("Accordion.Header must be used within an Accordion.Item");
  }

  const isOpen = activeId === itemContext.id;

  return (
    <button
      onClick={() => toggleItem(itemContext.id)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "16px",
        background: isOpen ? "#f8fafc" : "#fff",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: 600,
        fontSize: "15px",
      }}
    >
      <span>{children}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
};

// 5. Component Accordion.Body
interface AccordionBodyProps {
  children: ReactNode;
}

const AccordionBody = ({ children }: AccordionBodyProps) => {
  const { activeId } = useAccordionContext();
  const itemContext = useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error("Accordion.Body must be used within an Accordion.Item");
  }

  const isOpen = activeId === itemContext.id;

  if (!isOpen) return null;

  return (
    <div style={{ padding: "16px", backgroundColor: "#fff", color: "#475569", lineHeight: 1.6 }}>
      {children}
    </div>
  );
};

// Gắn các sub-component vào Accordion
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

// ============================================================================
// PHẦN 3: DEMO KẾT HỢP ACCORDION & USEPAGINATION CHO DANH SÁCH SẢN PHẨM
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "P1", name: "Bàn phím cơ Custom", price: 1500000, description: "Switch Gateron Yellow, gõ êm, hotswap 5 pin.", category: "Phụ kiện" },
  { id: "P2", name: "Chuột Gaming Không Dây", price: 950000, description: "Cảm biến quang học 16000 DPI, pin 70 tiếng liên tục.", category: "Phụ kiện" },
  { id: "P3", name: "Tai nghe chống ồn", price: 2300000, description: "Chống ồn chủ động ANC, kết nối bluetooth 5.3 đa điểm.", category: "Âm thanh" },
  { id: "P4", name: "Màn hình 27 inch 2K", price: 5400000, description: "Tấm nền IPS 165Hz, chuẩn màu 99% sRGB làm đồ hoạ.", category: "Màn hình" },
  { id: "P5", name: "Giá đỡ Laptop nhôm", price: 320000, description: "Nhôm nguyên khối cắt CNC, tản nhiệt tốt, nâng hạ 6 nấc.", category: "Phụ kiện" },
];

export const ProductListDemo = () => {
  // Áp dụng Generic usePagination<Product>
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
    <div style={{ maxWidth: "600px", margin: "24px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "16px" }}>Danh Sách Sản Phẩm (Trang {currentPage}/{totalPages})</h2>

      {/* Accordion chỉ mở 1 panel tại 1 thời điểm */}
      <Accordion>
        {pagedProducts.map((product) => (
          <Accordion.Item key={product.id} id={product.id}>
            <Accordion.Header>
              {product.name} - {product.price.toLocaleString("vi-VN")} đ
            </Accordion.Header>
            <Accordion.Body>
              <p><strong>Danh mục:</strong> {product.category}</p>
              <p><strong>Mô tả chi tiết:</strong> {product.description}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Điều khiển phân trang */}
      <div style={{ display: "flex", gap: "8px", marginTop: "16px", alignItems: "center", justifyContent: "center" }}>
        <button onClick={prevPage} disabled={!canPrevPage} style={{ padding: "6px 12px" }}>
          Trang trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            style={{
              padding: "6px 12px",
              fontWeight: currentPage === page ? "bold" : "normal",
              backgroundColor: currentPage === page ? "#3b82f6" : "#f1f5f9",
              color: currentPage === page ? "#fff" : "#000",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        ))}

        <button onClick={nextPage} disabled={!canNextPage} style={{ padding: "6px 12px" }}>
          Trang sau
        </button>
      </div>
    </div>
  );
};