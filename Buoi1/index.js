"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getStudents() {
    return __awaiter(this, void 0, void 0, function* () {
        const mockStudents = [
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
    });
}
function isAdmin(u) {
    return u.role === "admin";
}
function handleUser(u) {
    if (isAdmin(u)) {
        console.log(`[Admin] Quyền hạn: ${u.permissions.join(", ")}`);
    }
    else {
        console.log(`[User] Điểm tích lũy: ${u.point}`);
    }
}
// ==========================================
// BÀI 3: METHOD & PROPERTY DECORATORS
// ==========================================
function Log(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`[Log Method] Gọi hàm '${propertyKey}' với tham số:`, JSON.stringify(args));
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
// Decorator Readonly đúng chuẩn slide (Slide 13):
// Khóa thuộc tính bằng Object.defineProperty với writable: false
function Readonly(target, key) {
    let val;
    Object.defineProperty(target, key, {
        get: () => val,
        set: (newVal) => {
            if (val === undefined) {
                val = newVal; // Cho phép gán giá trị khởi tạo lần đầu tiên
            }
            else {
                throw new Error(`Thuộc tính '${key}' là chỉ đọc (Readonly), không thể gán lại!`);
            }
        },
        enumerable: true,
        configurable: false
    });
}
class AppConfig {
    constructor() {
        this.apiUri = "https://api.ptit.edu.vn";
    }
    createOrder(id, amount) {
        console.log(`-> Tạo đơn hàng ${id} thành công với số tiền ${amount}đ`);
        return { orderId: id, status: "SUCCESS" };
    }
}
__decorate([
    Readonly
], AppConfig.prototype, "apiUri", void 0);
__decorate([
    Log
], AppConfig.prototype, "createOrder", null);
// ==========================================
// THỰC THI & TEST KẾT QUẢ CẢ 3 BÀI
// ==========================================
function runAll() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("=== KẾT QUẢ CHẠY BÀI THỰC HÀNH ===\n");
        // --- Chạy Bài 1 ---
        console.log("--- TEST BÀI 1 ---");
        const res = yield getStudents();
        console.log("Status:", res.statusCode);
        console.log("Message:", res.message);
        console.log("Dữ liệu SV:", res.data.items[0]);
        // --- Chạy Bài 2 ---
        console.log("\n--- TEST BÀI 2 ---");
        const u1 = { role: "admin", permissions: ["CREATE", "DELETE"] };
        const u2 = { role: "user", point: 100 };
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
            config.apiUri = "https://link-khac.com";
        }
        catch (err) {
            console.log("-> Thành công chặn ghi đè:", err.message);
        }
        console.log("Giá trị apiUri sau khi thử ghi đè:", config.apiUri);
    });
}
runAll();
