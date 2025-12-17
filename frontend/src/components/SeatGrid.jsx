import { useState } from "react";
import Seat from "./Seat";

// SeatGrid: tạo lưới ghế và quản lý trạng thái chọn ghế
function SeatGrid({ rows = 5, cols = 8 }) {
  // selectedSeats lưu tập id ghế đang được chọn (Set giúp tìm/xoá nhanh)
  const [selectedSeats, setSelectedSeats] = useState(() => new Set());

  // toggleSeat: bật/tắt trạng thái chọn cho ghế có id
  // dùng updater function để tránh thay đổi trực tiếp state (immutability)
  const toggleSeat = (id) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev); // tạo bản sao
      if (next.has(id)) next.delete(id); // nếu đã chọn -> bỏ
      else next.add(id); // nếu chưa chọn -> thêm
      return next;
    });
  };

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
      className="grid gap-8"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {seats.map((id) => (
        <Seat
          key={id} // key cho list rendering
          text={id} // hiển thị id ghế trên nút
          selected={selectedSeats.has(id)} // true nếu ghế nằm trong Set
          onClick={() => toggleSeat(id)} // chuyển đổi trạng thái khi click
        />
      ))}
    </div>
  );
}

export default SeatGrid;
