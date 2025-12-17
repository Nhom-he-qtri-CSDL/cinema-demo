function Seat({ text, onClick, selected = false }) {
  const stateColor = selected
    ? "bg-[var(--selected-color)]"
    : "bg-[var(--empty-color)]";
  return (
    <button
      type="button"
      className={`w-[50px] h-[50px] ${stateColor} rounded flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="text-sm">{text}</span>
    </button>
  );
}
export default Seat;
