// ==========================================
// 1. ENUMS (Định nghĩa tập hằng số cố định)
// ==========================================
// Trạng thái đơn hàng: Tránh hard-code chuỗi ký tự rải rác trong code
enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

// Phương thức thanh toán
enum PaymentMethod {
  COD = "COD",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER"
}

// ==========================================
// 2. BASE ENTITIES (4 thực thể chính)
// ==========================================

// Thực thể Khách hàng
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Thực thể Sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
}

// Thực thể Chi tiết món hàng trong đơn
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Thực thể Đơn hàng chính (có quan hệ dữ liệu với Customer và OrderItem)
interface Order {
  id: string;
  customerId: string;
  customer?: Customer;          // Quan hệ: 1 Order thuộc về 1 Customer
  items: OrderItem[];           // Quan hệ: 1 Order chứa nhiều OrderItem
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 3. GENERICS (Tái sử dụng cấu trúc phản hồi API)
// ==========================================

// Khuôn mẫu chuẩn bọc phản hồi trả về từ Backend (không dùng any)
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// ==========================================
// 4. UTILITY TYPES (Tái sử dụng và biến đổi type)
// ==========================================

// 1. Omit: Dùng khi Client gửi yêu cầu tạo đơn hàng mới
// Bỏ các trường hệ thống tự sinh như 'id', 'totalAmount', 'createdAt', 'updatedAt'
type CreateOrderDTO = Omit<Order, "id" | "totalAmount" | "createdAt" | "updatedAt">;

// 2. Partial: Dùng cho chức năng cập nhật thông tin đơn hàng
// Cho phép sửa đổi một hoặc vài thuộc tính tuỳ ý mà không cần truyền toàn bộ Object
type UpdateOrderDTO = Partial<Omit<Order, "id">>;

// 3. Pick: Tối ưu hiển thị danh sách tóm tắt (Preview) trên giao diện quản trị
type OrderSummary = Pick<Order, "id" | "totalAmount" | "status" | "createdAt">;

// ==========================================
// 5. THỰC THI & KIỂM TRA MẪU (TEST LOGIC)
// ==========================================

const sampleCustomer: Customer = {
  id: "CUST-001",
  name: "Nguyễn Văn A",
  email: "vana@ptit.edu.vn",
  phone: "0987654321",
  address: "Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội"
};

const newOrderPayload: CreateOrderDTO = {
  customerId: sampleCustomer.id,
  items: [
    { productId: "PROD-1", productName: "Chuột không dây", quantity: 2, unitPrice: 250000 }
  ],
  status: OrderStatus.PENDING,
  paymentMethod: PaymentMethod.COD
};

const response: ApiResponse<CreateOrderDTO> = {
  statusCode: 201,
  message: "Khởi tạo đơn hàng thành công",
  data: newOrderPayload,
  timestamp: new Date().toISOString()
};

console.log("Dữ liệu tạo đơn:", JSON.stringify(response, null, 2));