import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Context của Accordion cha (Quản lý trạng thái đóng/mở tập trung)
interface AccordionContextType {
  activeId: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Các thành phần con của Accordion phải nằm trong <Accordion>");
  }
  return context;
}

// 2. Context của từng Accordion.Item (Truyền ID xuống Header & Body)
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

// 3. Component Container chính
interface AccordionProps {
  children: ReactNode;
  defaultActiveId?: string | null;
}

export function Accordion({ children, defaultActiveId = null }: AccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  // Logic Single Open: bấm vào panel đang mở thì thu gọn (null), bấm panel khác thì mở nó ra
  const toggleItem = (id: string) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem }}>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// 4. Component Accordion.Item
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

// 5. Component Accordion.Header
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
        padding: "16px 20px",
        backgroundColor: isOpen ? "#f8fafc" : "#ffffff",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontWeight: 600,
        fontSize: "15px",
        color: isOpen ? "#1e40af" : "#1e293b",
        transition: "background-color 0.2s ease",
      }}
    >
      <span>{children}</span>
      <span style={{ fontSize: "12px", color: "#64748b" }}>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

// 6. Component Accordion.Body
interface AccordionBodyProps {
  children: ReactNode;
}

function AccordionBody({ children }: AccordionBodyProps) {
  const { activeId } = useAccordionContext();
  const { id } = useAccordionItemContext();

  if (activeId !== id) return null;

  return (
    <div style={{ padding: "16px 20px", backgroundColor: "#ffffff", color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

// Đóng gói Static Properties chuẩn Compound Component Pattern
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;