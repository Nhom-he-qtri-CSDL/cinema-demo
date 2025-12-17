import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransparentCard from "../components/Transparent_card";
import SeatGrid from "../components/SeatGrid";
import { SCREEN_IMAGE, IMAGE_EMPTY } from "../utils/constants";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import "../styles/seats.css";

function Seats() {
  const { user } = useContext(AuthContext);
  const { selectedSeats, currentShow } = useContext(BookingContext);
  const navigate = useNavigate();
  const { showId } = useParams();
  const [movieInfo] = useState({
    id: 1,
    title: "Avatar: Lửa Và Tro Tàn",
  });

  useEffect(() => {
    // If no show selected, redirect back
    if (!currentShow) {
      alert("Vui lòng chọn suất chiếu!");
      navigate("/movies");
    }
  }, [currentShow, navigate]);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    if (!currentShow) {
      alert("Thông tin suất chiếu không hợp lệ!");
      return;
    }

    // Create complete booking data
    const bookingInfo = {
      movie: movieInfo,
      show: currentShow,
      seats: selectedSeats,
      totalPrice: selectedSeats.length * 100000, // 100,000 VND per seat
      user: user,
      bookingDate: new Date().toLocaleDateString("vi-VN"),
    };

    // Navigate with booking info
    navigate("/booking-result", {
      state: { success: true, booking: bookingInfo },
    });
  };

  return (
    <div className="seats-page">
      <TransparentCard className="seats-page__theater">
        {/* curved "screen" */}
        <img
          src={SCREEN_IMAGE.src}
          alt={SCREEN_IMAGE.alt}
          width={SCREEN_IMAGE.width}
          height={SCREEN_IMAGE.height}
          className="seats-page__screen"
        />
        {/* SeatGrid component */}
        <SeatGrid />
      </TransparentCard>
      <div className="seats-page__sidebar">
        <img
          src={IMAGE_EMPTY.src}
          alt={IMAGE_EMPTY.alt}
          width={IMAGE_EMPTY.width}
          height={IMAGE_EMPTY.height}
          className="seats-page__empty-image"
        />
        <TransparentCard className="seats-page__selected-card">
          <h2 className="seats-page__selected-title">Thông tin đặt vé</h2>
          {currentShow && (
            <div
              style={{
                marginBottom: "12px",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <p>🎬 Suất: {currentShow.time}</p>
              <p>📅 Ngày: {currentShow.date}</p>
              <p>🎥 Định dạng: {currentShow.format}</p>
              <p>🏛️ Phòng: {currentShow.theater}</p>
            </div>
          )}
          <h3
            style={{
              fontSize: "15px",
              marginTop: "12px",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Ghế đã chọn
          </h3>
          {selectedSeats.length > 0 ? (
            <div>
              <p style={{ marginBottom: "12px" }}>{selectedSeats.join(", ")}</p>
              <p
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  padding: "10px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "6px",
                  borderLeft: "3px solid var(--success-color)",
                }}
              >
                💰 Tổng:{" "}
                {(selectedSeats.length * 100000).toLocaleString("vi-VN")} VND
              </p>
            </div>
          ) : (
            <p>Chưa có ghế nào được chọn.</p>
          )}
        </TransparentCard>
        <TransparentCard className="seats-page__user-card">
          <p className="seats-page__user-name">
            {user?.username || user?.email || "Khách hàng"}
          </p>
        </TransparentCard>
        <Button
          onClick={handleBooking}
          variant="success"
          className="seats-page__book-button"
          disabled={selectedSeats.length === 0}
        >
          Đặt vé
        </Button>
      </div>
    </div>
  );
}

export default Seats;
