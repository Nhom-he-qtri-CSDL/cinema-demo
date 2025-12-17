import { useContext, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import Seat from "./Seat";
import "../styles/seatgrid.css";

// SeatGrid: tạo lưới ghế và quản lý trạng thái chọn ghế
function SeatGrid({ rows = 5, cols = 8, onSeatsChange }) {
  const { selectedSeats, addSeat, removeSeat } = useContext(BookingContext);

  // toggleSeat: bật/tắt trạng thái chọn cho ghế có id
  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      removeSeat(id);
    } else {
      addSeat(id);
    }
  };

  // Notify parent component when seats change
  useEffect(() => {
    if (onSeatsChange) {
      onSeatsChange(selectedSeats);
    }
  }, [selectedSeats, onSeatsChange]);

  // rowLabels: tạo nhãn hàng A, B, C,... dựa trên số hàng
  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // seats: xây mảng id ghế dạng A1, A2, ..., B1, B2, ...
  const seats = [];
  rowLabels.forEach((r) => {
    for (let c = 1; c <= cols; c++) seats.push(`${r}${c}`);
  });

  // render: grid CSS với số cột bằng props cols,
  // mỗi phần tử là <Seat /> truyền text, trạng thái selected và onClick
  return (
    <div
      className="seat-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {seats.map((id) => (
        <Seat
          key={id} // key cho list rendering
          text={id} // hiển thị id ghế trên nút
          selected={selectedSeats.includes(id)} // true nếu ghế có trong array
          onClick={() => toggleSeat(id)} // chuyển đổi trạng thái khi click
        />
      ))}
    </div>
  );
}

export default SeatGrid;
