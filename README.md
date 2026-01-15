# 🎬 Cinema Booking System - Concurrency Control Demo

> **Hệ thống đặt vé xem phim online với trọng tâm demo PostgreSQL Concurrency Control**

[![Tech Stack](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Tech Stack](https://img.shields.io/badge/Golang-1.21-00ADD8)](https://go.dev/)
[![Tech Stack](https://img.shields.io/badge/PostgreSQL-15-316192)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📚 TÀI LIỆU THUYẾT TRÌNH

Tôi đã chuẩn bị **4 tài liệu hoàn chỉnh** để giúp bạn thuyết trình:

### 🎯 Quick Start - Đọc theo thứ tự này:


 **[PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md)** 📖 **MAIN DOCUMENT**
   - Tổng quan hệ thống dễ hiểu
   - Concurrency Control giải thích chi tiết
   - Timeline 3 users competing
   - Demo script từng bước
   - Q&A preparation

 **[CHEAT_SHEET.md](CHEAT_SHEET.md)** 📝 **IN RA GIẤY**
   - Tóm tắt cực ngắn (~100 dòng)
   - Key points quan trọng
   - Code snippets cần nhớ
   - Mang theo khi thuyết trình

 **[FLOW_DIAGRAM_DETAILED.md](FLOW_DIAGRAM_DETAILED.md)** 🔍 **THAM KHẢO**
   - Chi tiết kỹ thuật đầy đủ (1000+ dòng)
   - Architecture diagrams
   - Code examples
   - API reference

---

## 🚀 Quick Start

### 1. Setup Database
```powershell
# Install PostgreSQL và tạo database
createdb cinema_db

# Import schema (nếu có file migrations)
psql -U postgres -d cinema_db -f backend/migrations/cinema.sql
```

### 2. Start Backend
```powershell
cd backend

# Start Core Service (Port 8081)
go run cmd/core/main.go

# Start BFF Service (Port 8080) - Terminal khác
go run cmd/bff/main.go
```

### 3. Start Frontend
```powershell
cd frontend
npm install
npm run dev  # Port 5173
```

### 4. Test Concurrency
```powershell
cd backend
.\test_cinema_concurrency.ps1
```

---

## 🎯 Điểm Nổi Bật Dự Án

### ⭐ Core Feature: Concurrency Control

**Vấn đề**: Nhiều users đồng thời đặt cùng 1 ghế → Race Condition

**Giải pháp**: PostgreSQL Transaction + Optimistic Locking

```go
// Key Code: Optimistic Locking
UPDATE seats
SET status = 'booked'
WHERE seat_id = ANY($1)
  AND status = 'available'  ← Chỉ update nếu available!

// Conflict Detection
if rowsAffected != len(seats) {
    return error  // → Auto ROLLBACK
}
```

**Kết quả**: 
- ✅ Chỉ 1 user thành công
- ❌ Các users khác nhận conflict error
- ✅ Data integrity được đảm bảo

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────┐
│   Browser   │ React SPA (Port 5173)
└──────┬──────┘
       │ HTTP REST API
┌──────▼──────────────────┐
│   BFF Layer (8080)      │ API Gateway
│   • JWT Validation      │
│   • Rate Limiting       │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│ Core Backend (8081)     │ Business Logic
│   ┌────────────────┐   │
│   │  Controllers   │   │
│   │  Services      │   │ Transaction Management
│   │  Repositories  │   │
│   └────────────────┘   │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│  PostgreSQL (5432)      │ ACID Transactions
│  • Row-Level Locking    │
│  • Concurrency Control  │
└─────────────────────────┘
```

---

## 📊 Database Schema

```
users (1) ──────────── (N) bookings
movies (1) ─────────── (N) shows
shows (1) ──────────── (N) seats
seats (1) ──────────── (1) bookings
```

**5 Core Tables**:
- `users` - Người dùng
- `movies` - Danh sách phim
- `shows` - Suất chiếu
- `seats` - Ghế ngồi (⭐ Concurrency target)
- `bookings` - Lịch sử đặt vé

---

## 🔄 User Flow

```
Login → Browse Movies → Select Show → View Seats
  ↓
Select Seats → Click "Book"
  ↓
POST /api/book → Transaction BEGIN
  ↓
UPDATE seats WHERE status='available' ⭐
  ↓
Check rowsAffected
  ↓
  ├─ Success → INSERT bookings → COMMIT ✅
  └─ Fail → ROLLBACK ❌
```

---

## 💻 Tech Stack

### Frontend
- **React 19.2** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State Management
- **Axios** - HTTP Client

### Backend
- **Golang** - Programming Language
- **Gin Framework** - Web Framework
- **Clean Architecture** - Design Pattern
- **JWT** - Authentication
- **GORM/SQL** - Database Access

### Database
- **PostgreSQL 15+** - RDBMS
- **ACID Transactions** - Data Integrity
- **Row-Level Locking** - Concurrency Control

---

## 📚 Tài Liệu Chi Tiết

### Backend Documentation
- [backend/README.md](backend/README.md) - Backend overview
- [backend/QUICKSTART.md](backend/QUICKSTART.md) - Quick start guide

### Frontend Documentation
- [frontend/README_Frontend.md](frontend/README_Frontend.md) - Frontend structure

### Presentation Documentation
- [HOW_TO_USE_DOCS.md](HOW_TO_USE_DOCS.md) - How to use all docs
- [PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md) - Main presentation guide
- [CHEAT_SHEET.md](CHEAT_SHEET.md) - Quick reference
- [SLIDE_OUTLINE.md](SLIDE_OUTLINE.md) - PowerPoint outline

---

## 🎓 Learning Objectives

### Database Concepts
✅ **Transactions** - BEGIN, COMMIT, ROLLBACK
✅ **Atomicity** - All or nothing principle
✅ **Consistency** - Data integrity maintained
✅ **Isolation** - Concurrent transactions
✅ **Durability** - Committed data persists

### Concurrency Control
✅ **Optimistic Locking** - WHERE clause approach
✅ **Pessimistic Locking** - SELECT FOR UPDATE (not used)
✅ **Race Condition** - Problem & solution
✅ **Conflict Detection** - rowsAffected validation

### Software Engineering
✅ **Clean Architecture** - Separation of concerns
✅ **RESTful API** - HTTP methods & status codes
✅ **JWT Authentication** - Token-based auth
✅ **Error Handling** - Graceful degradation

---

## 🧪 Testing Concurrency

### Scenario: 3 Users Competing for Same Seats

```powershell
# Run concurrency test script
.\backend\test_cinema_concurrency.ps1

# Expected result:
# ✅ User 1: 200 OK - Booking successful
# ❌ User 2: 400 Bad Request - Seats already booked
# ❌ User 3: 400 Bad Request - Seats already booked
```

### Verify in Database
```sql
SELECT * FROM seats WHERE show_id = 1;
-- Seats booked by User 1 will have status = 'booked'

SELECT * FROM bookings ORDER BY booked_at DESC;
-- Only User 1's booking exists
```

---

## 🎤 Q&A - Common Questions

**Q: Tại sao dùng Optimistic Locking?**
💡 Vì conflict rate thấp, performance tốt, code đơn giản hơn Pessimistic Locking.

**Q: WHERE status='available' có tác dụng gì?**
💡 Đây là core của Optimistic Locking - chỉ update nếu ghế còn trống.

**Q: Tại sao check rowsAffected?**
💡 Để detect conflict - nếu update ít hơn số ghế request thì có ghế đã bị đặt.

**Q: Nếu connection mất giữa transaction?**
💡 Auto ROLLBACK - PostgreSQL đảm bảo uncommitted transaction tự động rollback.

---

## 🚀 Future Enhancements

### Phase 1: Security & Performance
- Password hashing (bcrypt)
- Rate limiting per user
- Redis caching
- Database indexing

### Phase 2: Features
- Payment integration (VNPay, MoMo)
- Multi-theater support
- Mobile app (React Native)
- Email notifications

### Phase 3: Advanced
- Microservices architecture
- AI movie recommendations
- Real-time seat updates (WebSocket)
- Auto-scaling infrastructure

---

## 👥 Team & Contact

**Dự án môn**: Hệ Quản Trị Cơ Sở Dữ Liệu

**Tác giả**: [Tên của bạn]

**Liên hệ**: [Email/GitHub]

---

## 📝 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- PostgreSQL Documentation
- Clean Architecture by Robert C. Martin
- Golang Community
- React Community

---

**⭐ Star this repo if you find it helpful for your learning!**
