# Frontend

## Cấu trúc thư mục

frontend/
├── api/
│ ├── axiosClient.js
│ ├── authApi.js
│ ├── movieApi.js
│ ├── showApi.js
│ ├── seatApi.js
│ └── bookingApi.js
│
├── components/
│ ├── Button.jsx
│ ├── Seat.jsx
│ ├── SeatGrid.jsx
│ ├── MovieCard.jsx
│ └── ShowCard.jsx
│
├── pages/
│ ├── Login.jsx
│ ├── Movies.jsx
│ ├── Shows.jsx
│ ├── Seats.jsx
│ ├── BookingResult.jsx
│ └── MyTickets.jsx
│
├── context/
│ ├── AuthContext.jsx
│ └── BookingContext.jsx
│
├── layout/
│ ├── Header.jsx
│ ├── Footer.jsx
│ └── MainLayout.jsx
│
├── routes/
│ └── AppRoutes.jsx
│
├── utils/
│ └── constants.js
│
├── styles/
│ └── main.css
│
├── App.jsx
└── main.jsx

## Luồng tổng thể

login -> movies -> shows -> seats -> bookingResult -> MyTickets

## Ghi chú ngắn

- api/: các wrapper gọi API (axios).
- components/: các component tái sử dụng.
- pages/: các trang (route targets).
- context/: provider cho auth/booking.
- layout/: header/footer và layout chung.
- routes/: cấu hình route của ứng dụng.
- utils/ và styles/: hằng số và stylesheet chính.
