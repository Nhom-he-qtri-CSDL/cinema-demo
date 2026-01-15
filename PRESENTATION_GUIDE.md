# 🎬 CINEMA BOOKING SYSTEM - TÀI LIỆU THUYẾT TRÌNH

## 📌 TỔNG QUAN NHANH

### Mục đích dự án
Hệ thống đặt vé xem phim online với **trọng tâm là demo Concurrency Control** - giải quyết vấn đề race condition khi nhiều user đồng thời đặt cùng một ghế.

### Công nghệ sử dụng
- **Frontend**: React 19.2 + Vite + Tailwind CSS
- **Backend**: Golang + Gin Framework
- **Database**: PostgreSQL 15+ (ACID Transactions)
- **Kiến trúc**: Client-Server với BFF Layer (Backend For Frontend)

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
┌─────────────┐
│   Browser   │ Client Layer (React SPA)
└──────┬──────┘
       │ HTTP/REST API
┌──────▼──────────────────┐
│   BFF Layer (Port 8080) │ API Gateway
│   • JWT Validation      │
│   • Rate Limiting       │
│   • API Key Check       │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│ Core Backend (Port 8081)│ Business Logic
│ ┌──────────────────┐   │
│ │  Controllers     │   │ HTTP Handlers
│ └────────┬─────────┘   │
│ ┌────────▼─────────┐   │
│ │  Services        │   │ Business Logic + Transactions
│ └────────┬─────────┘   │
│ ┌────────▼─────────┐   │
│ │  Repositories    │   │ Database Access
│ └────────┬─────────┘   │
└──────────┼──────────────┘
           │
┌──────────▼──────────────┐
│  PostgreSQL Database    │ Data Layer
│  • ACID Transactions    │
│  • Row-Level Locking    │
│  • Concurrency Control  │
└─────────────────────────┘
```

**Clean Architecture**: Tách biệt rõ ràng giữa các layer, dễ maintain và test.

---

## 🔄 FLOW CHÍNH CỦA HỆ THỐNG

### 1. Authentication Flow (Đăng nhập)
```
User nhập email/password
    ↓
Frontend gửi POST /api/login
    ↓
Backend validate thông tin
    ↓
Kiểm tra password (bcrypt)
    ↓
Generate JWT token (24h expiry)
    ↓
Frontend lưu token vào localStorage
    ↓
Redirect đến trang chủ
```

### 2. Movie Browsing Flow (Xem phim)
```
User vào trang Movies
    ↓
GET /api/movies → Lấy danh sách phim
    ↓
User chọn phim → Navigate to /shows
    ↓
GET /api/shows?movie_id=X → Lấy suất chiếu
    ↓
User chọn suất chiếu → Navigate to /seats
```

### 3. Seat Selection & Booking Flow (Đặt ghế) ⭐ **CORE FEATURE**
```
User vào trang chọn ghế
    ↓
GET /api/seats?show_id=X → Load tất cả ghế
    ↓
User click chọn ghế (available → selected)
    ↓
User click "Đặt vé"
    ↓
POST /api/book { seats: [6, 9, 12] }
    ↓
**CONCURRENCY CONTROL** (Xử lý race condition)
    ↓
Success → Chuyển trang xác nhận
Failure → Clear selection, refresh danh sách ghế
```

---

## 🔒 CONCURRENCY CONTROL - TRỌNG TÂM DỰ ÁN

### Vấn đề (Race Condition)
**Tình huống**: 3 users cùng đặt ghế số 9 trong cùng 1 giây
- Nếu không có cơ chế kiểm soát → Cả 3 đều đặt thành công → **DATA CORRUPTION**
- Thực tế: Chỉ có 1 user được phép đặt ghế đó

### Giải pháp: PostgreSQL Transaction + Optimistic Locking

#### Bước 1: Backend Service - Transaction Management
```go
// book_service.go
func (s *BookService) BookSeats(ctx context.Context, userID int64, seats []int) error {
    // Bắt đầu transaction
    tx, err := s.bookRepo.BeginTransaction(ctx)
    if err != nil {
        return err
    }
    defer tx.Rollback() // Auto rollback nếu có lỗi
    
    // Bước 1: Cập nhật ghế
    err = s.seatRepo.BookSeats(ctx, tx, userID, seats)
    if err != nil {
        return err // Rollback tự động
    }
    
    // Bước 2: Tạo booking record
    err = s.bookRepo.CreateBooking(ctx, tx, userID, seats)
    if err != nil {
        return err // Rollback tự động
    }
    
    // Commit - Lưu thay đổi vào DB
    return tx.Commit()
}
```

#### Bước 2: Repository - Optimistic Locking
```go
// seat_repo.go
func (s *seatRepo) BookSeats(ctx context.Context, tx *sql.Tx, userID int64, seats []int) error {
    // CRITICAL: Chỉ update ghế NẾU status = 'available'
    res, err := tx.ExecContext(ctx,
        `UPDATE seats
         SET status = $1
         WHERE seat_id = ANY($2)
           AND status = $3`, // Điều kiện này là KEY!
        "booked",              // $1
        pq.Array(seats),       // $2
        "available",           // $3
    )
    
    // Kiểm tra số hàng bị ảnh hưởng
    affected, _ := res.RowsAffected()
    
    // Nếu không đủ số ghế → Có ghế đã bị book rồi
    if int(affected) != len(seats) {
        return errors.New("one or more seats already booked")
    }
    
    return nil // Success
}
```

### Timeline - 3 Users Competing

```
t0 (0ms):  User A, B, C đều click "Đặt vé" cùng lúc
           User A muốn: [6, 9, 12]
           User B muốn: [9, 12, 15]
           User C muốn: [12, 15, 18]

t1 (10ms): PostgreSQL nhận 3 transactions
           - Transaction A: BEGIN
           - Transaction B: BEGIN
           - Transaction C: BEGIN

t2 (15ms): Transaction A execute trước (PostgreSQL quyết định)
           UPDATE seats SET status='booked' 
           WHERE seat_id IN (6,9,12) AND status='available'
           
           Result: 3 rows affected ✅
           → Ghế 6, 9, 12 đều available → Đặt thành công
           
           COMMIT → Ghế 6, 9, 12 giờ là "booked"

t3 (20ms): Transaction B execute
           UPDATE seats SET status='booked' 
           WHERE seat_id IN (9,12,15) AND status='available'
           
           Result: 1 row affected ❌
           → Chỉ ghế 15 còn available (ghế 9, 12 đã booked)
           → Check: 1 != 3 → FAIL
           
           ROLLBACK → Không có thay đổi nào được lưu

t4 (25ms): Transaction C execute
           UPDATE seats SET status='booked' 
           WHERE seat_id IN (12,15,18) AND status='available'
           
           Result: 1 row affected ❌
           → Chỉ ghế 18 còn available
           → Check: 1 != 3 → FAIL
           
           ROLLBACK → Không có thay đổi nào được lưu

t5 (30ms): Response về Frontend
           User A: 200 OK → Success page
           User B: 400 Bad Request → Error + Refresh seats
           User C: 400 Bad Request → Error + Refresh seats
```

### Tại sao giải pháp này hiệu quả?

1. **Atomicity (Tính nguyên tử)**
   - Tất cả các bước trong transaction thành công HOẶC tất cả thất bại
   - Không có trường hợp "một nửa thành công"

2. **Optimistic Locking**
   - `WHERE status = 'available'` đảm bảo chỉ update ghế còn trống
   - Không cần lock table hay lock row trước khi update

3. **Conflict Detection**
   - Check `rowsAffected` để phát hiện conflict
   - Nếu có ghế đã bị book → Rollback toàn bộ

4. **Database-Level Control**
   - PostgreSQL tự quản lý concurrent transactions
   - Không cần mutex/lock ở application layer
   - Performance tốt hơn application-level locking

5. **All or Nothing**
   - Đặt hết 3 ghế hoặc không đặt ghế nào
   - Không có trường hợp đặt được 1-2 ghế

---

## 📊 DATABASE SCHEMA

### Các bảng chính

#### 1. users (Người dùng)
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hash
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. movies (Phim)
```sql
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    duration INT NOT NULL,           -- phút
    description TEXT,
    url_image VARCHAR(500),
    rate DECIMAL(2,1),               -- 0.0 - 10.0
    genre VARCHAR(100),
    release_date DATE,
    director VARCHAR(200),
    cast_list TEXT
);
```

#### 3. shows (Suất chiếu)
```sql
CREATE TABLE shows (
    show_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(movie_id),
    show_time TIMESTAMP NOT NULL,
    cinema_hall VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

#### 4. seats (Ghế ngồi) ⭐ **CONCURRENCY TARGET**
```sql
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    show_id INT NOT NULL REFERENCES shows(show_id),
    seat_name VARCHAR(5) NOT NULL,   -- A1, A2, B1...
    status VARCHAR(10) NOT NULL CHECK (status IN ('available', 'booked')),
    UNIQUE (show_id, seat_name)      -- Mỗi ghế unique trong 1 suất chiếu
);
```

#### 5. bookings (Đặt vé)
```sql
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    seat_id INT NOT NULL REFERENCES seats(seat_id),
    booked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (seat_id)                 -- 1 ghế chỉ có 1 booking
);
```

### Relationships (Mối quan hệ)
```
users (1) ──────────── (N) bookings
movies (1) ─────────── (N) shows
shows (1) ──────────── (N) seats
seats (1) ──────────── (1) bookings
```

---

## 🎯 DEMO SCRIPT CHO THUYẾT TRÌNH

### Phần 1: Giới thiệu (2 phút)
1. Mở slide tổng quan
2. Giải thích mục đích: Demo Concurrency Control trong DBMS
3. Tech stack overview

### Phần 2: Kiến trúc (3 phút)
1. Show diagram kiến trúc
2. Giải thích Clean Architecture
3. Vai trò của từng layer

### Phần 3: Demo Flow cơ bản (5 phút)
1. **Login**
   - Mở browser, login với user1
   - Show token trong localStorage (F12 Console)
   
2. **Browse Movies**
   - Navigate qua các trang: Movies → Shows → Seats
   - Show API calls trong Network tab
   
3. **Select Seats**
   - Chọn 2-3 ghế
   - Explain UI states (available/selected/booked)

### Phần 4: Demo Concurrency Control (8 phút) ⭐ **HIGHLIGHT**

#### Setup:
```powershell
# Mở 3 terminal
# Terminal 1: User 1 đặt ghế 6, 9, 12
# Terminal 2: User 2 đặt ghế 9, 12, 15  
# Terminal 3: User 3 đặt ghế 12, 15, 18
```

#### Demo:
1. **Show code quan trọng**
   ```go
   // Mở file seat_repo.go
   // Highlight dòng WHERE status = 'available'
   // Explain tại sao điều kiện này quan trọng
   ```

2. **Chạy test concurrent**
   ```powershell
   # Chạy script test
   .\backend\test_cinema_concurrency.ps1
   ```
   
3. **Quan sát kết quả**
   - Chỉ 1 request thành công (200 OK)
   - 2 requests thất bại (400 Bad Request)
   - Show database: `SELECT * FROM seats WHERE show_id = 1`
   
4. **Giải thích Timeline**
   - Draw trên whiteboard timeline của 3 transactions
   - Explain PostgreSQL xử lý như thế nào

### Phần 5: Q&A Preparation (2 phút)
Chuẩn bị trả lời các câu hỏi:

**Q: Tại sao không dùng SELECT FOR UPDATE?**
A: Optimistic locking phù hợp hơn vì:
- Ít conflict trong thực tế (ít user đặt cùng ghế)
- Performance tốt hơn (không lock row sớm)
- Code đơn giản hơn

**Q: Nếu 2 transactions commit cùng lúc thì sao?**
A: Không thể! PostgreSQL đảm bảo serializable - một transaction phải commit trước transaction kia.

**Q: Tại sao không dùng mutex/lock trong code Go?**
A: Database-level locking mạnh mẽ hơn vì:
- Hoạt động với multiple backend instances
- ACID guarantees từ database
- Không cần sync giữa các Go processes

**Q: Điều gì xảy ra nếu connection bị mất giữa transaction?**
A: Auto ROLLBACK - PostgreSQL tự động rollback transaction chưa commit khi connection đóng.

---

## 📈 KẾT LUẬN

### Thành tựu kỹ thuật
1. ✅ Implement thành công Concurrency Control
2. ✅ Không có race condition
3. ✅ Data integrity được đảm bảo (ACID)
4. ✅ User experience tốt (error handling)

### Bài học rút ra
1. **Database transactions** là công cụ mạnh mẽ
2. **Optimistic locking** phù hợp cho low-conflict scenarios
3. **Clean Architecture** giúp code dễ hiểu và maintain
4. **Error handling** quan trọng trong concurrent systems

### Hướng phát triển
1. **Performance**: Add Redis caching
2. **Scalability**: Multiple backend instances
3. **Features**: Payment integration, QR code tickets
4. **Monitoring**: Add logging, metrics, tracing

---

## 🔧 TROUBLESHOOTING

### Common Issues

#### Issue 1: Port đã được sử dụng
```powershell
# Kill process trên port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

#### Issue 2: Database connection failed
```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Restart service
net stop postgresql-x64-15
net start postgresql-x64-15
```

#### Issue 3: Frontend không connect được backend
```javascript
// Check CORS settings trong backend
// Check API_BASE_URL trong frontend
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## 📚 TÀI LIỆU THAM KHẢO

1. **PostgreSQL Transaction Isolation**
   - https://www.postgresql.org/docs/current/transaction-iso.html

2. **Optimistic vs Pessimistic Locking**
   - https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking

3. **Clean Architecture in Go**
   - https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

4. **React Context API**
   - https://react.dev/reference/react/createContext

---

## 🎬 BONUS: Demo Commands

### Start Backend
```powershell
cd backend
go run cmd/core/main.go   # Core service (Port 8081)
go run cmd/bff/main.go    # BFF service (Port 8080)
```

### Start Frontend
```powershell
cd frontend
npm run dev               # Vite dev server (Port 5173)
```

### Test Concurrency
```powershell
cd backend
.\test_cinema_concurrency.ps1
```

### Check Database
```sql
-- Login to psql
psql -U postgres -d cinema_db

-- Check seats
SELECT * FROM seats WHERE show_id = 1 ORDER BY seat_name;

-- Check bookings
SELECT b.booking_id, u.name, s.seat_name, b.booked_at
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN seats s ON b.seat_id = s.seat_id
ORDER BY b.booked_at DESC;
```

---

**Good luck với presentation! 🚀**
