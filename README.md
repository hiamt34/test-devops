# Mini LMS - DevOps Engineer Test

## 1. Mô tả chung

Bài kiểm tra dành cho ứng viên vị trí **DevOps Engineer**.

Ứng dụng web mini cho phép:
- Quản lý thông tin Học sinh – Phụ huynh
- Tạo và lên lịch Lớp học cho học sinh
- Quản lý Subscription (gói học): khởi tạo, theo dõi buổi đã dùng/còn lại

Yêu cầu thể hiện:
- Database schema phù hợp
- RESTful API cho các nghiệp vụ chính
- Giao diện đơn giản để tương tác với API
- Cấu trúc project rõ ràng, có CI/CD script (Dockerfile + script build/run)

## 2. Cách dựng project (build/run với Docker)

```bash
docker compose up -d
```

```
FE: http://localhost:5173/
BE: http://localhost:3000/
```

---

## 3. CI/CD Pipeline Diagram

```mermaid
graph TD
    A[Dev push code lên GitHub] --> B[GitHub Actions CI/CD]
    B --> C[Build, Test, Lint]
    C --> D{Nhánh main?}
    D -- No --> E[Chỉ kiểm tra, không deploy]
    E --> F[Notify Discord (success/fail)]
    D -- Yes --> G[SSH vào server]
    G --> H[cd app && git pull origin main]
    H --> I[make runapp]
    I --> J[Notify Discord (success/fail)]
    C --> K[Notify Discord (fail)]
    G --> L[Notify Discord (fail)]
    H --> M[Notify Discord (fail)]
```

**Mô tả luồng:**
- Khi dev push code lên GitHub (hoặc tạo pull request), GitHub Actions sẽ tự động build, test, lint.
- Nếu code được merge vào nhánh `main`, CI/CD sẽ SSH vào server, pull code mới nhất về, và chạy `make runapp` để khởi động lại app.
- Nếu không phải nhánh main, chỉ kiểm tra code, không deploy lên server.
- **CI/CD sẽ gửi thông báo về Discord:**
  - Nếu bất kỳ bước nào (build, lint, test, deploy) lỗi: gửi noti lỗi
  - Nếu toàn bộ pipeline thành công: gửi noti thành công

**Ví dụ nội dung thông báo Discord:**
- Thành công:
  ```
  ✅ Backend CI/CD SUCCESS on <repo>
  Commit: <sha>
  Author: <actor>
  Workflow: <workflow>
  <link tới run>
  ```
- Thất bại (bất kỳ bước nào):
  ```
  ❌ Backend CI/CD FAILED on <repo>
  Commit: <sha>
  Author: <actor>
  Workflow: <workflow>
  <link tới run>
  ```

---

## 4. Mô tả sơ lược database schema

- **Parents**: `id`, `name`, `phone`, `email`
- **Students**: `id`, `name`, `dob`, `gender`, `current_grade`, `parent_id`
- **Classes**: `id`, `name`, `subject`, `day_of_week`, `time_slot`, `teacher_name`, `max_students`
- **ClassRegistrations**: `class_id`, `student_id`
- **Subscriptions**: `id`, `student_id`, `package_name`, `start_date`, `end_date`, `total_sessions`, `used_sessions`

## 5. data seed

```json
{
  "parents": [
    { "id": "parent-1", "name": "Parent 1", "phone": "0916922561", "email": "parent1@seeder.com" },
    { "id": "parent-2", "name": "Parent 2", "phone": "0916922562", "email": "parent2@seeder.com" }
  ],
  "students": [
    { "id": "student-1", "name": "Student 1", "dob": "2000-01-01", "gender": "MALE", "currentGrade": 1, "parentId": "parent-1" },
    { "id": "student-2", "name": "Student 2", "dob": "2000-01-02", "gender": "FEMALE", "currentGrade": 2, "parentId": "parent-2" },
    { "id": "student-3", "name": "Student 3", "dob": "2000-01-03", "gender": "OTHER", "currentGrade": 3, "parentId": "parent-1" }
  ],
  "classes": [
    { "id": "class-1", "name": "Class 1", "subject": "Math", "dayOfWeek": 1, "timeSlot": "09:00-10:00", "teacherName": "Teacher 1", "maxStudents": 10 },
    { "id": "class-2", "name": "Class 2", "subject": "Science", "dayOfWeek": 2, "timeSlot": "09:30-11:00", "teacherName": "Teacher 2", "maxStudents": 10 },
    { "id": "class-3", "name": "Class 3", "subject": "English", "dayOfWeek": 3, "timeSlot": "10:00-12:00", "teacherName": "Teacher 3", "maxStudents": 10 }
  ]
}
```

## 6. (Tùy chọn) Demo API bằng curl

```bash
# Tạo phụ huynh
curl -X POST http://localhost:3000/api/parents -H "Content-Type: application/json" -d '{"name":"Parent 1","phone":"0916922563","email":"parent3@seeder.com"}'

# Tạo học sinh
curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d '{"name":"Student 1","dob":"2000-01-01","gender":"male","currentGrade":1,"parentId":"parent-1"}'

# Tạo lớp học
curl -X POST http://localhost:3000/api/classes -H "Content-Type: application/json" -d '{"name":"Class 1","subject":"Math","dayOfWeek":1,"timeSlot":"09:00-10:00","teacherName":"Teacher 1","maxStudents":10}'

# Đăng ký học sinh vào lớp
curl -X POST http://localhost:3000/api/classes/class-1/register -H "Content-Type: application/json" -d '{"studentId":"student-2"}'

# Khởi tạo gói học
curl -X POST http://localhost:3000/api/subscriptions -H "Content-Type: application/json" -d '{"studentId":"student-1","packageName":"Gói 10 buổi","startDate":"2024-06-01","endDate":"2024-08-01","totalSessions":10}'

# Đánh dấu đã dùng 1 buổi
curl -X PATCH http://localhost:3000/api/subscriptions/${subscriptionID}/use

# Xem trạng thái gói
curl http://localhost:3000/api/subscriptions/${subscriptionID}
```

