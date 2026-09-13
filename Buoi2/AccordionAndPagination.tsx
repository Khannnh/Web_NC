import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
// ============================================================================
// 1. CUSTOM HOOK: usePagination<T>
// Yêu cầu: Nhận vào data: T[], itemsPerPage; trả về page hiện tại, total, next/prev/goToPage
// ============================================================================

export interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn<T> {
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

  // Tính tổng số trang (ít nhất là 1 trang)
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  // Đảm bảo trang hiện tại luôn nằm trong khoảng [1, totalPages]
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Cắt mảng dữ liệu hiển thị cho trang hiện tại
  const currentData = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, validPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  };

  const nextPage = () => {
    if (validPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (validPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage: validPage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    canNextPage: validPage < totalPages,
    canPrevPage: validPage > 1,
  };
}
// ============================================================================
// 2. COMPOUND COMPONENT: Accordion
// Yêu cầu: Nhiều panel, chỉ mở 1 panel tại 1 thời điểm, dùng Context API tương tự Tabs
// ============================================================================

// Context chính cho Accordion cha
interface AccordionContextType {
  activeId: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Các component con của Accordion phải nằm trong thẻ <Accordion>");
  }
  return context;
}

// Context cho từng Accordion.Item
interface AccordionItemContextType {
  id: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("<Accordion.Header> và <Accordion.Body> phải nằm trong <Accordion.Item>");
  }
  return context;
}

// Component cha: Accordion
interface AccordionProps {
  children: ReactNode;
  defaultActiveId?: string | null;
}

export function Accordion({ children, defaultActiveId = null }: AccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  // Logic: Nếu click vào panel đang mở thì đóng, click panel khác thì mở nó và tự đóng panel cũ
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
}

// Component con: Accordion.Item
interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

function AccordionItem({ id, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div style={{ borderBottom: "1px solid #e2e8f0" }}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

// Component con: Accordion.Header
interface AccordionHeaderProps {
  children: ReactNode;
}

function AccordionHeader({ children }: AccordionHeaderProps) {
  const { activeId, toggleItem } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeId === id;

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        background: isOpen ? "#f8fafc" : "#ffffff",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "15px",
        textAlign: "left",
      }}
    >
      <span>{children}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

// Component con: Accordion.Body
interface AccordionBodyProps {
  children: ReactNode;
}

function AccordionBody({ children }: AccordionBodyProps) {
  const { activeId } = useAccordionContext();
  const { id } = useAccordionItemContext();

  if (activeId !== id) return null;

  return (
    <div style={{ padding: "16px 18px", backgroundColor: "#fff", color: "#475569", lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

// Đóng gói static property theo chuẩn Compound Component
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

// ============================================================================
// 3. DEMO: KẾT HỢP ACCORDION & USEPAGINATION VỚI DANH SÁCH SẢN PHẨM
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: "p1", name: "Bàn phím cơ Aula F75", price: 1250000, category: "Bàn phím", description: "Mạch xuôi, gõ êm, pin 4000mAh, kết nối 3 mode linh hoạt." },
  { id: "p2", name: "Chuột Dragonfly F1 Pro", price: 950000, category: "Chuột", description: "Trọng lượng siêu nhẹ 49g, mắt đọc PAW3395 chuẩn gaming." },
  { id: "p3", name: "Màn hình ViewSonic 27 inch 2K", price: 4800000, category: "Màn hình", description: "Tấm nền Fast IPS, độ sáng 350 nits, chuẩn màu 99% sRGB." },
  { id: "p4", name: "Tai nghe Moondrop Space Travel", price: 590000, category: "Tai nghe", description: "Chống ồn chủ động ANC, chất âm chi tiết trong tầm giá." },
  { id: "p5", name: "Giá đỡ laptop hợp kim nhôm", price: 290000, category: "Phụ kiện", description: "Nhôm nguyên khối CNC chắc chắn, gấp gọn tiện lợi." },
];

export function HomeworkBuoi2Demo() {
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
    data: SAMPLE_PRODUCTS,
    itemsPerPage: 2,
  });

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "16px", color: "#1e293b" }}>
        Danh Sách Sản Phẩm (Trang {currentPage}/{totalPages})
      </h2>

      {/* Accordion chỉ mở 1 panel tại 1 thời điểm */}
      <Accordion defaultActiveId="p1">
        {pagedProducts.map((product) => (
          <Accordion.Item key={product.id} id={product.id}>
            <Accordion.Header>
              {product.name} — {product.price.toLocaleString("vi-VN")} đ
            </Accordion.Header>
            <Accordion.Body>
              <p><strong>Danh mục:</strong> {product.category}</p>
              <p><strong>Mô tả:</strong> {product.description}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Điều khiển Pagination */}
      <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center", alignItems: "center" }}>
        <button
          type="button"
          onClick={prevPage}
          disabled={!canPrevPage}
          style={{ padding: "6px 12px", cursor: canPrevPage ? "pointer" : "not-allowed" }}
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: currentPage === page ? "bold" : "normal",
              backgroundColor: currentPage === page ? "#2563eb" : "#f1f5f9",
              color: currentPage === page ? "#ffffff" : "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
            }}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={nextPage}
          disabled={!canNextPage}
          style={{ padding: "6px 12px", cursor: canNextPage ? "pointer" : "not-allowed" }}
        >
          Sau
        </button>
      </div>
    </div>
  );
}