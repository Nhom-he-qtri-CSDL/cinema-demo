import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Transparent_card from "../components/Transparent_card";
import Button from "../components/Button";
import {
  CALENDAR_ICON,
  TIME_ICON,
  CHAIR_ICON,
  USER_ICON,
  CINEMA_ICON,
} from "../utils/constants";
import { BookingContext } from "../context/BookingContext";
import "../styles/bookingresult.css";

function BookingResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearSeats, saveTicket } = useContext(BookingContext);

  const success = location.state?.success ?? false;
  const booking = location.state?.booking;

  useEffect(() => {
    // Clear seats and save ticket after successful booking (only once)
    if (success && booking && booking.seats && booking.seats.length > 0) {
      saveTicket(booking);
      clearSeats();
    }
    // Only run once when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewMyTickets = () => {
    navigate("/my-tickets");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="booking-result">
      <div
        className={`booking-result__status ${
          success
            ? "booking-result__status--success"
            : "booking-result__status--error"
        }`}
      >
        <h2>{success ? "Đặt vé thành công!" : "Đặt vé thất bại!"}</h2>
      </div>
      <Transparent_card className="booking-result__details">
        {success && booking && booking.seats ? (
          <div className="booking-result__info">
            <p className="booking-result__info-item">
              <img
                src={CINEMA_ICON.src}
                alt={CINEMA_ICON.alt}
                width={CINEMA_ICON.width}
                height={CINEMA_ICON.height}
              />
              <span>Tên phim: {booking.movie?.title || "Phim demo"}</span>
            </p>
            <p className="booking-result__info-item">
              <img
                src={TIME_ICON.src}
                alt={TIME_ICON.alt}
                width={TIME_ICON.width}
                height={TIME_ICON.height}
              />
              <span>
                Giờ chiếu: {booking.show?.time || "Chưa xác định"} -{" "}
                {booking.show?.date || ""}
                {booking.show?.theater && ` (${booking.show.theater})`}
              </span>
            </p>
            <p className="booking-result__info-item">
              <img
                src={CHAIR_ICON.src}
                alt={CHAIR_ICON.alt}
                width={CHAIR_ICON.width}
                height={CHAIR_ICON.height}
              />
              <span>Ghế đã đặt: {booking.seats?.join(", ") || "Không có"}</span>
            </p>
            <p className="booking-result__info-item">
              <img
                src={USER_ICON.src}
                alt={USER_ICON.alt}
                width={USER_ICON.width}
                height={USER_ICON.height}
              />
              <span>
                Tên khách hàng:{" "}
                {booking.user?.username || booking.user?.email || "Khách hàng"}
              </span>
            </p>
            <p className="booking-result__info-item">
              <img
                src={CALENDAR_ICON.src}
                alt={CALENDAR_ICON.alt}
                width={CALENDAR_ICON.width}
                height={CALENDAR_ICON.height}
              />
              <span>
                Ngày đặt vé:{" "}
                {booking.bookingDate || new Date().toLocaleDateString("vi-VN")}
              </span>
            </p>
            {booking.totalPrice && (
              <p
                className="booking-result__info-item"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderLeft: "3px solid var(--success-color)",
                }}
              >
                <span>
                  💰 Tổng tiền: {booking.totalPrice.toLocaleString("vi-VN")} VND
                </span>
              </p>
            )}
          </div>
        ) : (
          <p>Ghế đã được người khác đặt hoặc có lỗi xảy ra</p>
        )}
      </Transparent_card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        {success && (
          <Button variant="success" onClick={handleViewMyTickets}>
            Xem vé của tôi
          </Button>
        )}
        <Button variant="secondary" onClick={handleBackToHome}>
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
}

export default BookingResult;
