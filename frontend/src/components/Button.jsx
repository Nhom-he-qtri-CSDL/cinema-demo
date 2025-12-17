import React from "react";

const VARIANT_MAP = {
  success: "var(--success-color)",
  secondary: "var(--secondary-color)",
  accent: "var(--accent-color)",
};

/**
 * Props:
 * - variant: 'success' | 'secondary' | 'accent' (default: 'success')
 * - children, onClick, disabled, type, className
 */
export default function Button({
  variant = "success",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) {
  const bg = VARIANT_MAP[variant] || VARIANT_MAP.success;
  const style = {
    backgroundColor: bg,
    height: "60px",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
    borderRadius: "8px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "20px",
    fontWeight: 600,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
    >
      {children}
    </button>
  );
}
