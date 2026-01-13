import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransparentCard from "../components/Transparent_card";
import SeatGrid from "../components/SeatGrid";
import { SCREEN_IMAGE, IMAGE_EMPTY } from "../utils/constants";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import seatApi from "../api/seatApi";
import bookingApi from "../api/bookingApi";
import "../styles/seats.css";

function Seats() {
  const { user } = useContext(AuthContext);
  const { selectedSeats, currentShow, clearSeats } = useContext(BookingContext);
  const navigate = useNavigate();
  const { showId } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // New state for refresh feedback

  // Fetch seats from backend - Extract to reusable function
  const fetchSeats = async () => {
    if (!showId || !currentShow) {
      return;
    }

    try {
      setLoading(true);
      const response = await seatApi.getSeats(showId);
      // Backend trả về { response: [...] }
      setSeats(response.response || []);

      // Set movie info from current show
      if (currentShow.movie_title) {
        setMovieInfo({
          id: currentShow.movie_id,
          title: currentShow.movie_title,
        });
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching seats:", err);
      setError("Không thể tải danh sách ghế. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [showId, currentShow]);

  // Clear seats when unmounting
  useEffect(() => {
    return () => clearSeats();
  }, [clearSeats]);

  useEffect(() => {
    // If no show selected, redirect back
    if (!currentShow) {
      alert("Vui lòng chọn suất chiếu!");
      navigate("/movies");
    }
  }, [currentShow, navigate]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    if (!currentShow || !showId) {
      alert("Thông tin suất chiếu không hợp lệ!");
      return;
    }

    try {
      setBooking(true);

      // selectedSeats giờ đã chứa seat IDs (integers) rồi
      // Backend expects: { "seats": [6, 9] } (array of integers)
      if (selectedSeats.length === 0) {
        alert("Vui lòng chọn ít nhất một ghế!");
        return;
      }

      // Call booking API with seat IDs - JWT token tự động gửi qua header
      const response = await bookingApi.bookSeats(selectedSeats);

      // Get seat names for display
      const selectedSeatNames = selectedSeats.map((seatId) => {
        const seat = seats.find((s) => s.seat_id === seatId);
        return seat ? seat.seat_name : `Seat ${seatId}`;
      });

      // Create complete booking data
      const bookingInfo = {
        movie: movieInfo,
        show: currentShow,
        seats: selectedSeatNames, // For display
        seatIds: selectedSeats, // Original IDs
        totalPrice: selectedSeats.length * 100000, // 100,000 VND per seat
        user: user,
        bookingDate: new Date().toLocaleDateString("vi-VN"),
        bookingResponse: response,
      };

      // Clear selected seats
      clearSeats();

      // Navigate with booking info
      navigate("/booking-result", {
        state: { success: true, booking: bookingInfo },
      });
    } catch (err) {
      console.error("Booking failed:", err);

      // Reset UI with latest seat data when booking fails
      console.log("🔄 Booking failed, refreshing seat data...");

      // Set refreshing state for UI feedback
      setRefreshing(true);

      // Clear selected seats immediately to reset UI
      clearSeats();

      // Fetch latest seat availability from server
      try {
        await fetchSeats();
        console.log("✅ Seat data refreshed after booking failure");
      } catch (refreshError) {
        console.error("❌ Failed to refresh seat data:", refreshError);
      } finally {
        setRefreshing(false);
      }

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Đặt vé thất bại";

      // Show error with helpful message about refresh
      if (
        errorMsg.includes("already booked") ||
        errorMsg.includes("conflict") ||
        errorMsg.includes("409") ||
        errorMsg.includes("no longer available")
      ) {
        alert(
          `❌ Đặt vé thất bại: ${errorMsg}\n\n🔄 Trạng thái ghế đã được cập nhật tự động. Vui lòng chọn ghế khác.`
        );
      } else {
        alert(`❌ Đặt vé thất bại: ${errorMsg}`);
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="seats-page">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#00d4ff",
          }}
        >
          Đang tải thông tin ghế ngồi...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seats-page">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p
            style={{ fontSize: "18px", color: "#ff4444", marginBottom: "20px" }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/movies")}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Quay lại danh sách phim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seats-page">
      {refreshing && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#ff9800",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          🔄 Đang cập nhật trạng thái ghế...
        </div>
      )}

      <TransparentCard className="seats-page__theater">
        {/* curved "screen" */}
        <img
          src={SCREEN_IMAGE.src}
          alt={SCREEN_IMAGE.alt}
          width={SCREEN_IMAGE.width}
          height={SCREEN_IMAGE.height}
          className="seats-page__screen"
        />
        {/* SeatGrid component - 4 columns for demo database (A1-A4, B1-B4, C1-C4) */}
        <SeatGrid seatsData={seats} cols={4} />
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
              <p style={{ marginBottom: "12px" }}>
                {selectedSeats
                  .map((seatId) => {
                    const seat = seats.find((s) => s.seat_id === seatId);
                    return seat ? seat.seat_name : `#${seatId}`;
                  })
                  .join(", ")}
              </p>
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

        {/* Manual refresh button */}
        <Button
          onClick={async () => {
            setRefreshing(true);
            clearSeats();
            try {
              await fetchSeats();
              alert("🔄 Trạng thái ghế đã được cập nhật!");
            } catch (error) {
              console.error("Manual refresh failed:", error);
              alert("❌ Không thể cập nhật trạng thái ghế. Vui lòng thử lại.");
            } finally {
              setRefreshing(false);
            }
          }}
          variant="secondary"
          className="seats-page__refresh-button"
          disabled={refreshing || loading}
          style={{
            marginBottom: "10px",
            fontSize: "14px",
            backgroundColor: refreshing ? "#666" : "#2563eb",
            cursor: refreshing || loading ? "not-allowed" : "pointer",
          }}
        >
          {refreshing ? "🔄 Đang cập nhật..." : "🔄 Làm mới ghế"}
        </Button>

        <Button
          onClick={handleBooking}
          variant="success"
          className="seats-page__book-button"
          disabled={selectedSeats.length === 0 || booking || refreshing}
        >
          {booking ? "Đang đặt vé..." : "Đặt vé"}
        </Button>
      </div>
    </div>
  );
}

export default Seats;
