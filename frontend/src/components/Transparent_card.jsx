function TransparentCard({ children, className }) {
  return (
    <>
      <div
        className={`bg-[var(--card-color)] rounded-lg shadow-lg ${className}`}
      >
        {children}
      </div>
    </>
  );
}
export default TransparentCard;
