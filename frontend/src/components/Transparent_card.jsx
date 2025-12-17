import "../styles/transparent_card.css";

function TransparentCard({ children, className = "" }) {
  return <div className={`transparent-card ${className}`}>{children}</div>;
}

export default TransparentCard;
