// 1. Khai báo các trạng thái giao dịch
type TransactionStatus = 'PENDING' | 'SUCCESS' 
| 'FAILED' | 'REFUND';

// 2. Hàm tính phí
function getTransactionFee(status:TransactionStatus): 
number {
  switch (status) {
    case 'PENDING':
      return 0; // Đang xử lý -> chưa thu phí
    case 'SUCCESS':
      return 11000; // Thành công ->  11.000đ
    case 'FAILED':
      return 0; // Thất bại -> không thu phí
    default:
      // Bẫy lỗi exhaustive check ở đây
      const exhaustiveCheck: never = status;
      throw new Error
      (`Trạng thái không hợp lệ: ${exhaustiveCheck}`);
  }
}
console.log(getTransactionFee("REFUND"))