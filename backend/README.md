# Backend - Mini LMS

## 1. Yêu cầu môi trường

- **Node.js** >= 18
- **pnpm** >= 8
- **PostgreSQL** >= 15 (nếu chạy local ngoài Docker)
- **Docker** >= 20.10 (nếu chạy bằng Docker)
- **docker-compose** >= 1.29 (nếu chạy bằng Docker)

## 2. Cài đặt & Chạy Local

```bash
# Clone code
cd backend
pnpm install

# Tạo file .env (xem ví dụ .env.example hoặc README tổng)

# Chạy migrate/seed nếu cần (tùy project)
# pnpm run migrate
# pnpm run seed

# Chạy dev
pnpm run start:dev
```

## 3. Chạy bằng Docker

```bash
cd backend
# Sử dụng docker-compose.yml riêng cho backend
# (hoặc dùng docker compose ở root để chạy cả hệ thống)
docker compose up -d
```
- Sau khi chạy xong, backend sẽ tự động seed data mẫu vào database.
- API mặc định: http://localhost:3000/

## 4. Seed/Migrate Database

- Seed data sẽ tự động khi chạy Docker Compose.
- Nếu muốn seed/migrate thủ công:
  ```bash
  pnpm run seed
  # hoặc pnpm run migrate
  ```

## 5. Test

```bash
# Unit test
pnpm run test

# E2E test
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## 6. CI/CD

- Đã cấu hình GitHub Actions:
  - Tự động build, lint, test khi push/pull request.
  - Nếu thành công, tự động deploy lên server qua SSH, pull code, chạy lại app bằng Makefile.
  - Bất kỳ lỗi nào (build, test, deploy) đều gửi thông báo về Discord.

## 7. Các lệnh Makefile

- `make build` – Cài đặt và build backend
- `make runapp` – Chạy backend bằng Docker Compose
- `make stopapp` – Dừng backend Docker Compose

## 8. Tham khảo thêm
- Xem README.md ở thư mục gốc để biết hướng dẫn tổng thể, CI/CD, seed, cấu hình môi trường, data mẫu...
