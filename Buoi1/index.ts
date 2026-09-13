// ==========================================
// BÀI 1: GENERIC API RESPONSE & PAGINATED
// ==========================================
interface Course {
  id: string;
  title: string;
  credits: number;
}

interface Student {
  id: string;
  name: string;
  courses: Course[];
}

interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledDate: Date;
}

interface Paginated<T> {
  items: T[];
  page: number;
  total: number;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

async function getStudents(): Promise<ApiResponse<Paginated<Student>>> {
  const mockStudents: Student[] = [
    {
      id: "B21DCCN001",
      name: "Nguyễn Văn A",
      courses: [{ id: "INT1411", title: "Lập trình Web nâng cao", credits: 3 }]
    }
  ];

  return {
    statusCode: 200,
    message: "Lấy danh sách sinh viên thành công",
    data: {
      items: mockStudents,
      page: 1,
      total: 1
    }
  };
}

// ==========================================
// BÀI 2: CUSTOM TYPE GUARD
// ==========================================
interface AdminUser {
  role: "admin";
  permissions: string[];
}

interface NormalUser {
  role: "user";
  point: number;
}

type AppUser = AdminUser | NormalUser;

function isAdmin(u: AppUser): u is AdminUser {
  return u.role === "admin";
}

function handleUser(u: AppUser) {
  if (isAdmin(u)) {
    console.log(`[Admin] Quyền hạn: ${u.permissions.join(", ")}`);
  } else {
    console.log(`[User] Điểm tích lũy: ${u.point}`);
  }
}

// ==========================================
// BÀI 3: METHOD & PROPERTY DECORATORS
// ==========================================
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[Log Method] Gọi hàm '${propertyKey}' với tham số:`, JSON.stringify(args));
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Decorator Readonly đúng chuẩn slide (Slide 13):
// Khóa thuộc tính bằng Object.defineProperty với writable: false
function Readonly(target: any, key: string) {
  let val: any;
  Object.defineProperty(target, key, {
    get: () => val,
    set: (newVal: any) => {
      if (val === undefined) {
        val = newVal; // Cho phép gán giá trị khởi tạo lần đầu tiên
      } else {
        throw new Error(`Thuộc tính '${key}' là chỉ đọc (Readonly), không thể gán lại!`);
      }
    },
    enumerable: true,
    configurable: false
  });
}

class AppConfig {
  @Readonly
  apiUri: string = "https://api.ptit.edu.vn";

  @Log
  createOrder(id: string, amount: number) {
    console.log(`-> Tạo đơn hàng ${id} thành công với số tiền ${amount}đ`);
    return { orderId: id, status: "SUCCESS" };
  }
}

// ==========================================
// THỰC THI & TEST KẾT QUẢ CẢ 3 BÀI
// ==========================================
async function runAll() {
  console.log("=== KẾT QUẢ CHẠY BÀI THỰC HÀNH ===\n");

  // --- Chạy Bài 1 ---
  console.log("--- TEST BÀI 1 ---");
  const res = await getStudents();
  console.log("Status:", res.statusCode);
  console.log("Message:", res.message);
  console.log("Dữ liệu SV:", res.data.items[0]);

  // --- Chạy Bài 2 ---
  console.log("\n--- TEST BÀI 2 ---");
  const u1: AppUser = { role: "admin", permissions: ["CREATE", "DELETE"] };
  const u2: AppUser = { role: "user", point: 100 };
  handleUser(u1);
  handleUser(u2);

  // --- Chạy Bài 3 ---
  console.log("\n--- TEST BÀI 3 ---");
  const config = new AppConfig();
  
  // 1. Test gọi method có gắn @Log
  config.createOrder("DH-01", 250000);

  // 2. Test thuộc tính có gắn @Readonly
  console.log("Giá trị apiUri ban đầu:", config.apiUri);

  try {
    console.log("-> Thử ghi đè apiUri sang link khác...");
    (config as any).apiUri = "https://link-khac.com";
  } catch (err: any) {
    console.log("-> Thành công chặn ghi đè:", err.message);
  }

  console.log("Giá trị apiUri sau khi thử ghi đè:", config.apiUri);
}

runAll();