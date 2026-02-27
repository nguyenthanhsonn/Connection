# Social Real-time Chat & Network Application

Một ứng dụng mạng xã hội và chat trực tiếp được xây dựng bằng **NestJS**, tập trung vào hiệu năng cao, bảo mật và trải nghiệm người dùng mượt mà.

## 🚀 Công nghệ sử dụng

- **Backend Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: MySQL với [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (JSON Web Token) với Passport.js
- **Real-time**: [Socket.io](https://socket.io/) (WebSockets)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger API UI
- **Language**: TypeScript

## ✨ Các tính năng chính

### 1. Hệ thống Hội thoại (Refactored)
- **Chat trực tiếp**: Hỗ trợ nhắn tin thời gian thực giữa các người dùng.
- **Danh sách Chat thông minh**: Hiển thị danh sách các cuộc hội thoại gần nhất, bao gồm cả các phòng mới kết nối (ví dụ: vừa follow nhau) nhưng chưa có tin nhắn.
- **Sắp xếp tối ưu**: Tự động đưa các cuộc hội thoại có tin nhắn mới nhất hoặc người mới kết nối lên đầu danh sách.
- **Hiệu năng**: Sử dụng QueryBuilder tối ưu để tránh lỗi N+1 và giảm thiểu dữ liệu tải về.

### 2. Mạng xã hội
- **Quản lý người dùng**: Đăng ký, đăng nhập (JWT), quản lý profile (avatar, bio).
- **Follow System**: Người dùng có thể theo dõi nhau (Followers/Following).
- **Post System**: Đăng bài viết, like bài viết và lưu bài viết (Post Save).
- **Thông báo**: Hệ thống thông báo thời gian thực cho các tương tác của người dùng.

### 3. Bảo mật & Kiến trúc
- **DTO Validation**: Kiểm soát chặt chẽ dữ liệu đầu vào.
- **Response Serialization**: Sử dụng DTO để ẩn các thông tin nhạy cảm (như password) khi trả về client.
- **Modular Design**: Tổ chức code theo các module riêng biệt như `chats`, `users`, `room`, `posts`, giúp dễ dàng mở rộng và bảo trì.

## 🛠 Cài đặt & Khởi chạy

### 1. Cài đặt các service phụ thuộc
Đảm bảo bạn đã cài đặt Node.js và MySQL trên hệ thống của mình.

### 2. Clone project và cài đặt dependencies
```bash
npm install
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```


