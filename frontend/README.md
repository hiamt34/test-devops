# Frontend - Mini LMS

## 1. Yêu cầu môi trường

- **Node.js** >= 18
- **pnpm** >= 8
- **Docker** >= 20.10 (nếu chạy bằng Docker)
- **docker-compose** >= 1.29 (nếu chạy bằng Docker)
- **Git**

## 2. Cài đặt & Chạy Local

```bash
# Clone code
cd frontend
pnpm install

# Tạo file .env (xem ví dụ .env.example hoặc README tổng)

# Chạy dev
pnpm run dev
```
- Ứng dụng sẽ chạy tại: http://localhost:5173/

## 3. Chạy bằng Docker

```bash
cd frontend
# Sử dụng docker-compose.yml riêng cho frontend
# (hoặc dùng docker compose ở root để chạy cả hệ thống)
docker compose up -d
```
- FE mặc định: http://localhost:5173/

## 4. Test

```bash
# Chạy test (nếu có)
pnpm run test
```

## 5. CI/CD

- Đã cấu hình GitHub Actions:
  - Tự động build, lint, test khi push/pull request.
  - Nếu thành công, tự động deploy lên server qua SSH, pull code, chạy lại app bằng Makefile.
  - Bất kỳ lỗi nào (build, test, deploy) đều gửi thông báo về Discord.

## 6. Các lệnh Makefile

- `make build` – Cài đặt và build frontend
- `make runapp` – Chạy frontend bằng Docker Compose
- `make stopapp` – Dừng frontend Docker Compose

## 7. Tham khảo thêm
- Xem README.md ở thư mục gốc để biết hướng dẫn tổng thể, CI/CD, seed, cấu hình môi trường, data mẫu, backend...
