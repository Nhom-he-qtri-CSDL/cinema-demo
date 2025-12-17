import { useContext, useEffect } from "react";
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
import "../styles/mytickets.css";

function MyTickets() {
  const { user } = useContext(AuthContext);
  const { tickets } = useContext(BookingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="mytickets-page">
        <h1 className="my-tickets__title">Vé Của Tôi</h1>
        <Transparent_card className="my-tickets__user-card">
          <p className="my-tickets__user-name">
            {user?.username || user?.email || "Khách hàng"}
          </p>
        </Transparent_card>
        {tickets.length > 0 ? (
          <div className="my-tickets__grid">
            {tickets.map((ticket) => (
              <Transparent_card
                key={ticket.id}
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
