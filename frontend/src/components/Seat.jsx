import "../styles/seat.css";

function Seat({ text, onClick, selected = false, booked = false }) {
  let seatClass = "seat seat--empty";

  if (booked) {
    seatClass = "seat seat--booked";
  } else if (selected) {
    seatClass = "seat seat--selected";
  }

  return (
    <button
      type="button"
      className={seatClass}
      onClick={onClick}
      aria-pressed={selected}
      disabled={booked}
      style={{ cursor: booked ? "not-allowed" : "pointer" }}
    >
      <span>{text}</span>
    </button>
  );
}

export default Seat;
