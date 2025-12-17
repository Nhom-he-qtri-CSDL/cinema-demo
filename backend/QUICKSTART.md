# 🚀 Quick Start Guide

## Prerequisites

1. **PostgreSQL** installed and running
2. **Go 1.21+** installed
3. **Database created**: `createdb cinema_db`

## 1-Minute Setup

```bash
# 1. Setup database
psql -d cinema_db -f migrations/cinema.sql

# 2. Run server (from backend directory)
go run .
```

Server will start at: http://localhost:8080

## Test Concurrency (After server is running, choose one)

### Option A: PowerShell (Windows)

```powershell
.\test_concurrency.ps1
```

### Option B: Bash (Linux/Mac/WSL)

```bash
./test_concurrency.sh
```

### Option C: Manual cURL

```bash
# Terminal 1
curl -X POST http://localhost:8080/api/book \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{"seat_id": 1}'

# Terminal 2 (run simultaneously)
curl -X POST http://localhost:8080/api/book \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 2" \
  -d '{"seat_id": 1}'
```

## Expected Results

✅ **One request**: `200 OK` - Booking successful  
❌ **Other requests**: `409 Conflict` - Seat already booked

This proves PostgreSQL's concurrency control works! 🎉

## API Endpoints

| Method | Endpoint               | Auth  | Description |
| ------ | ---------------------- | ----- | ----------- |
| GET    | `/api/movies`          | No    | List movies |
| GET    | `/api/seats?show_id=1` | No    | Show seats  |
| POST   | `/api/book`            | Yes\* | Book seat   |

\*Auth: Add header `X-User-ID: 1` (simple demo auth)

## Sample Data

**Users**: user1, user2, user3 (password: password123)  
**Movies**: Avatar, Top Gun  
**Shows**: Multiple showtimes available  
**Seats**: A1-A10, B1-B10 per show
