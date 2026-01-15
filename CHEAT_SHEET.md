# 🎯 CINEMA BOOKING - CHEAT SHEET

## ⚡ TÓM TẮT CỰC NGẮN GỌN

### Công nghệ
- **Frontend**: React + Vite + Tailwind
- **Backend**: Golang + Gin Framework  
- **Database**: PostgreSQL
- **Mô hình**: Client-Server RESTful API

### Flow cơ bản (7 bước)
```
1. Login → JWT token
2. Browse movies → GET /api/movies
3. Select show → GET /api/shows?movie_id=X
4. View seats → GET /api/seats?show_id=Y
5. Select seats → Local state update
6. Book seats → POST /api/book (Transaction)
7. View ticket → Success page
```

### Bảng Database (5 tables)
1. **users** - Người dùng
2. **movies** - Phim
3. **shows** - Suất chiếu
4. **seats** - Ghế ngồi (⭐ Concurrency target)
5. **bookings** - Booking records

---

## 🔒 CONCURRENCY CONTROL - TRỌNG TÂM

### Vấn đề
3 users đặt cùng 1 ghế → Chỉ 1 người thành công

### Giải pháp: Transaction + Optimistic Locking

#### Code Key
```go
// 1. BEGIN Transaction
tx, _ := db.Begin()
********************************************************
*// 2. UPDATE với điều kiện                            *
*UPDATE seats                                          * 
*SET status = 'booked'                                 *
*WHERE seat_id = ANY($1)                               *
*AND status = 'available'  ← KEY POINT!                *
********************************************************
// 3. Check rows affected
if rowsAffected != len(seats) {
    tx.Rollback()  // Có ghế đã bị đặt
}

// 4. INSERT booking
INSERT INTO bookings...

// 5. COMMIT
tx.Commit()
```

### Timeline
```
t0: User A, B, C click "Book" cùng lúc
t1: PostgreSQL nhận 3 transactions
t2: Transaction A execute → SUCCESS ✅
t3: Transaction B execute → FAIL ❌ (ghế đã booked)
t4: Transaction C execute → FAIL ❌ (ghế đã booked)
```

### Tại sao hiệu quả?
1. ✅ **Transaction atomicity** - All or nothing
2. ✅ **Row-level locking** - PostgreSQL tự quản lý
3. ✅ **Optimistic control** - Không lock sớm
4. ✅ **Conflict detection** - Check rowsAffected
5. ✅ **All or Nothing** - Đặt hết hoặc không đặt

---

## 💡 CÂU HỎI THƯỜNG GẶP

**Q: Tại sao dùng WHERE status='available'?**
A: Đây là Optimistic Locking - chỉ update nếu ghế còn trống. Nếu đã booked thì UPDATE không ảnh hưởng gì.

**Q: Tại sao check rowsAffected?**
A: Để detect conflict. Nếu request 3 ghế nhưng chỉ update được 2 → Có ghế đã bị đặt → Rollback hết.

**Q: Tại sao không dùng SELECT FOR UPDATE?**
A: Optimistic locking phù hợp hơn vì ít conflict, performance tốt hơn, code đơn giản hơn.

**Q: Nếu connection bị mất giữa transaction?**
A: Auto ROLLBACK - PostgreSQL tự động hủy transaction chưa commit.

---

## 🎬 DEMO CHECKLIST

### Chuẩn bị
- [ ] Start PostgreSQL service
- [ ] Start Backend (port 8080, 8081)
- [ ] Start Frontend (port 5173)
- [ ] Chuẩn bị 3 terminal để test concurrent

### Demo flow
1. [ ] Login user1 → Show JWT token
2. [ ] Browse movies → Show API calls
3. [ ] Select show → Navigate to seats
4. [ ] Show code: `seat_repo.go` (WHERE clause)
5. [ ] Show code: `book_service.go` (Transaction)
6. [ ] Run test script: `test_cinema_concurrency.ps1`
7. [ ] Show kết quả: 1 success, 2 failed
8. [ ] Query database: `SELECT * FROM seats WHERE show_id=1`

### Highlight points
- ⭐ WHERE status='available' - Key của optimistic locking
- ⭐ rowsAffected check - Conflict detection
- ⭐ Transaction COMMIT/ROLLBACK - Atomicity guarantee
- ⭐ Timeline diagram - Giải thích concurrent execution

---

## 📝 KEY MESSAGES

1. **PostgreSQL tự xử lý concurrency** - Không cần application lock
2. **Transactions đảm bảo ACID** - Data integrity được bảo vệ
3. **Optimistic locking phù hợp** - Low-conflict scenarios
4. **Clean Architecture** - Dễ maintain và test
5. **Real-world applicable** - Pattern dùng trong production

---

## 🚀 BONUS COMMANDS

```powershell
# Start services
cd backend
go run cmd/core/main.go &
go run cmd/bff/main.go &

cd frontend
npm run dev

# Test concurrency
cd backend
.\test_cinema_concurrency.ps1

# Check DB
psql -U postgres -d cinema_db
SELECT * FROM seats WHERE show_id = 1;
SELECT * FROM bookings ORDER BY booked_at DESC;
```

---

**Remember**: Tập trung vào **Concurrency Control** - đó là highlight của dự án! 🎯
