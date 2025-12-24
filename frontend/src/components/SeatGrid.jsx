import { useContext, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import Seat from "./Seat";
import "../styles/seatgrid.css";

// SeatGrid: tạo lưới ghế và quản lý trạng thái chọn ghế
function SeatGrid({ rows = 5, cols = 8, onSeatsChange, seatsData = [] }) {
  const { selectedSeats, addSeat, removeSeat } = useContext(BookingContext);

  // toggleSeat: bật/tắt trạng thái chọn cho ghế có id
  const toggleSeat = (seatName, isBooked) => {
    if (isBooked) {
      // Không cho phép chọn ghế đã được đặt
      return;
    }

    if (selectedSeats.includes(seatName)) {
      removeSeat(seatName);
    } else {
      addSeat(seatName);
    }
  };

  // Notify parent component when seats change
  useEffect(() => {
    if (onSeatsChange) {
      onSeatsChange(selectedSeats);
    }
  }, [selectedSeats, onSeatsChange]);

  // If seatsData from backend exists, use it
  if (seatsData && seatsData.length > 0) {
    return (
      <div
        className="seat-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {seatsData.map((seat) => {
          const isBooked = seat.status === "booked";
          return (
            <Seat
              key={seat.seat_id}
              text={seat.seat_name}
              selected={selectedSeats.includes(seat.seat_name)}
              booked={isBooked}
              onClick={() => toggleSeat(seat.seat_name, isBooked)}
            />
          );
        })}
      </div>
    );
  }

  // Fallback: generate default seat grid
  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const seats = [];
  rowLabels.forEach((r) => {
    for (let c = 1; c <= cols; c++) seats.push(`${r}${c}`);
  });

  return (
    <div
      className="seat-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {seats.map((id) => (
        <Seat
          key={id}
          text={id}
          selected={selectedSeats.includes(id)}
          onClick={() => toggleSeat(id, false)}
        />
      ))}
    </div>
  );
}

export default SeatGrid;
