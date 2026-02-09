# Social Media Backend (NestJS)

Một hệ thống Backend hoàn chỉnh cho ứng dụng mạng xã hội được xây dựng bằng **NestJS**, tích hợp các tính năng thời gian thực, quản lý bài đăng, tương tác người dùng và hệ thống chát chuyên sâu.

## 🚀 Tính năng chính

### 🔐 Bảo mật & Người dùng
- **Xác thực**: Đăng ký, đăng nhập sử dụng JWT (Passport).
- **Profile**: Xem và chỉnh sửa thông tin cá nhân, cập nhật avatar.
- **Follow System**: Theo dõi, bỏ theo dõi và chủ động xóa người theo dõi (giống Instagram).

### 📝 Bài bản & Tương tác
- **Bài đăng (Posts)**: Tạo, sửa, xóa bài viết kèm hình ảnh.
- **Tương tác**: Like bài viết, Lưu bài viết (Save), và Bình luận (Comments).
- **Optimized**: Sử dụng `Promise.all` và `QueryBuilder` để tối ưu hóa tốc độ truy vấn bài viết và lượt tương tác.

### 💬 Hệ thống Chat (Real-time)
- **Cơ chế**: Sử dụng Socket.IO với kiến trúc **Room-based** (giúp ổn định và bảo mật).
- **Inbox**: Hiển thị danh sách các cuộc hội thoại gần nhất kèm tin nhắn cuối cùng và thông tin đối phương.
- **Bảo mật chát**: Kiểm tra quyền thành viên trước khi cho phép gửi hoặc nhận tin nhắn trong phòng.

### 🔔 Thông báo
- Hệ thống thông báo thời gian thực cho các hành động Like, Comment, Follow.

---

## 🛠 Công nghệ sử dụng
- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Database**: MySQL
- **Real-time**: [Socket.io](https://socket.io/)
- **Security**: JWT, Bcrypt, Passport
- **Documentation**: Swagger UI

---

## 📦 Hướng dẫn cài đặt

### 1. Clone Project
```bash
git clone <your-repository-url>
cd DrugV2dot2/project
```

### 2. Cài đặt Dependencies
```bash
npm install
```

### 3. Cấu hình môi trường (Environment Variables)
Tạo file `.env` dựa trên file `.env.example` và điền các thông tin Database, JWT Secret của bạn:
```bash
cp .env.example .env
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 5. Quản lý Cơ sở dữ liệu (Migrations)
Sử dụng TypeORM Migrations để cập nhật cấu trúc Database:
```bash
# Tạo migration mới dựa trên thay đổi Entity
npm run migration:generate -- src/migrations/NameOfMigration

# Chạy migration để cập nhật Database
npm run migration:run

# Hoàn tác migration gần nhất
npm run migration:revert
```

### 6. Tài liệu API (Swagger)
Sau khi start server, bạn có thể truy cập tài liệu API tại:
`http://localhost:5050/api`

---

## 🏗 Cấu trúc thư mục
- `src/modules`: Chứa các module chức năng (Users, Posts, Chats, Follows, v.v.)
- `src/entities`: Chứa định nghĩa các bảng Database.
- `src/guards`: Chứa các lớp bảo mật (JWT Guard, Role Guard).
- `src/room`: Module quản lý phòng chat độc lập.


