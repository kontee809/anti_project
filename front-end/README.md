# Front-end Project

Dự án này sử dụng ReactJS, Vite và Tailwind CSS v4.

## Hướng dẫn cài đặt cho team/đồng nghiệp

Để chạy và phát triển dự án này trên máy local của bạn sau khi clone code về, vui lòng làm theo các bước sau:

### 1. Cài đặt các thư viện
Mở terminal tại thư mục `front-end` và chạy lệnh sau để tải tất cả các thư viện cần thiết (bao gồm ReactJS, Vite plugin và Tailwind CSS v4):
```bash
npm install
```

### 2. Thiết lập biến môi trường
Dự án có sử dụng file biến môi trường `.env`. Hãy tạo file `.env` của riêng bạn dựa trên file mẫu:
```bash
# Trên Linux/Mac
cp .env.example .env

# Trên Windows (PowerShell)
Copy-Item .env.example -Destination .env
```
*(Lưu ý: Bạn cũng có thể tự tạo một file trống tên `.env` ngang hàng với `package.json` và copy/paste toàn bộ nội dung từ `.env.example` sang, sau đó chỉnh sửa lại cho phù hợp với môi trường máy của bạn).*

### 3. Chạy dự án (Development mode)
Sau khi đã cài xong thư viện và thiết lập `.env`, khởi động server phát triển bằng lệnh:
```bash
npm run dev
```
Dự án sẽ khởi chạy và cung cấp link trên terminal (thường là [http://localhost:5173](http://localhost:5173)).
