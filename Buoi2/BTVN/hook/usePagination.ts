import { useState, useMemo } from "react";

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

  // Tính tổng số trang (tối thiểu là 1)
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  // Đảm bảo trang hiện tại luôn hợp lệ trong dải [1, totalPages]
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Cắt mảng dữ liệu ứng với trang hiện tại
  const currentData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, validCurrentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const nextPage = () => {
    if (validCurrentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (validCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage: validCurrentPage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    canNextPage: validCurrentPage < totalPages,
    canPrevPage: validCurrentPage > 1,
  };
}