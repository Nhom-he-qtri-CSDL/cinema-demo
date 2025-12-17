import "../styles/seat.css";

function Seat({ text, onClick, selected = false }) {
  const seatClass = selected ? "seat seat--selected" : "seat seat--empty";

  return (
    <button
      type="button"
      className={seatClass}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
    </button>
  );
}

export default Seat;
