import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Transparent_card from "../components/Transparent_card";
import Button from "../components/Button";
import {
  CALENDAR_ICON,
  TIME_ICON,
  CHAIR_ICON,
  USER_ICON,
  CINEMA_ICON,
} from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import bookingApi from "../api/bookingApi";
import "../styles/mytickets.css";

function MyTickets() {
  const { user } = useContext(AuthContext);
  const { tickets } = useContext(BookingContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null); // Track which booking is being cancelled

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getMyBookings();
        // Backend trả về { response: [...] }
        setBookings(response.response || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Không thể tải danh sách vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Bạn có chắc chắn muốn hủy vé này?")) {
      return;
    }

    try {
      setCancelling(bookingId);
      await bookingApi.cancelBooking(bookingId);

      // Remove cancelled booking from list
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));

      alert("Hủy vé thành công!");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Không thể hủy vé";
      alert(`Hủy vé thất bại: ${errorMsg}`);
    } finally {
      setCancelling(null);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="mytickets-page">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#00d4ff",
          }}
        >
          Đang tải danh sách vé...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mytickets-page">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p
            style={{ fontSize: "18px", color: "#ff4444", marginBottom: "20px" }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Group bookings by showId to display multiple seats in one card
  const groupedBookings = bookings.reduce((acc, booking) => {
    const showId = booking.show_id;

    if (!acc[showId]) {
      acc[showId] = {
        showId: showId,
        movieName: booking.title,
        showTime: new Date(booking.show_time).toLocaleString("vi-VN"),
        seats: [],
        bookingIds: [],
        customerName: user?.username || user?.email || "Khách hàng",
        bookingDate: new Date(booking.book_at).toLocaleDateString("vi-VN"),
        totalPrice: 0,
      };
    }

    acc[showId].seats.push(booking.seat_name);
    acc[showId].bookingIds.push(booking.booking_id);
    acc[showId].totalPrice += 100000; // 100k per seat

    return acc;
  }, {});

  // Convert to array and sort by show time
  const allTickets = Object.values(groupedBookings);

  return (
    <>
      <div className="mytickets-page">
        <h1 className="my-tickets__title">Vé Của Tôi</h1>
        <Transparent_card className="my-tickets__user-card">
          <p className="my-tickets__user-name">
            {user?.username || user?.email || "Khách hàng"}
          </p>
        </Transparent_card>
        {allTickets.length > 0 ? (
          <div className="my-tickets__grid">
            {allTickets.map((ticket) => (
              <Transparent_card
                key={ticket.showId}
                className="my-tickets__ticket-card"
              >
                <div className="my-tickets__ticket-info">
                  <p className="my-tickets__info-item">
                    <img
                      src={CINEMA_ICON.src}
                      alt={CINEMA_ICON.alt}
                      width={CINEMA_ICON.width}
                      height={CINEMA_ICON.height}
                    />
                    <span>Tên phim: {ticket.movieName}</span>
                  </p>
                  <p className="my-tickets__info-item">
                    <img
                      src={TIME_ICON.src}
                      alt={TIME_ICON.alt}
                      width={TIME_ICON.width}
                      height={TIME_ICON.height}
                    />
                    <span>Giờ chiếu: {ticket.showTime}</span>
                  </p>
                  <p className="my-tickets__info-item">
                    <img
                      src={CHAIR_ICON.src}
                      alt={CHAIR_ICON.alt}
                      width={CHAIR_ICON.width}
                      height={CHAIR_ICON.height}
                    />
                    <span>Ghế đã đặt: {ticket.seats.join(", ")}</span>
                  </p>
                  <p className="my-tickets__info-item">
                    <img
                      src={USER_ICON.src}
                      alt={USER_ICON.alt}
                      width={USER_ICON.width}
                      height={USER_ICON.height}
                    />
                    <span>Tên khách hàng: {ticket.customerName}</span>
                  </p>
                  <p className="my-tickets__info-item">
                    <img
                      src={CALENDAR_ICON.src}
                      alt={CALENDAR_ICON.alt}
                      width={CALENDAR_ICON.width}
                      height={CALENDAR_ICON.height}
                    />
                    <span>Ngày đặt vé: {ticket.bookingDate}</span>
                  </p>
                  {ticket.totalPrice && (
                    <p
                      className="my-tickets__info-item"
                      style={{
                        fontWeight: "bold",
                        marginTop: "8px",
                        background: "rgba(16, 185, 129, 0.1)",
                        borderLeft: "3px solid var(--success-color)",
                        padding: "10px",
                      }}
                    >
                      <span>
                        💰 Tổng tiền:{" "}
                        {ticket.totalPrice.toLocaleString("vi-VN")} VND
                      </span>
                    </p>
                  )}
                </div>

                {/* Cancel button - Cancel all seats in this show */}
                <Button
                  variant="danger"
                  className="my-tickets__cancel-button"
                  onClick={() => handleCancelBooking(ticket.bookingIds[0])}
                  disabled={cancelling === ticket.bookingIds[0]}
                  title={`Hủy ${ticket.seats.length} ghế`}
                >
                  {cancelling === ticket.bookingIds[0]
                    ? "Đang hủy..."
                    : `🗑️ Hủy vé (${ticket.seats.length} ghế)`}
                </Button>
              </Transparent_card>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-secondary)",
            }}
          >
            <p>Bạn chưa có vé nào.</p>
          </div>
        )}
        <Button
          variant="accent"
          className="my-tickets__back-button"
          onClick={handleBackToHome}
        >
          Trở về trang chủ
        </Button>
      </div>
    </>
  );
}

export default MyTickets;
