import React from "react";

const VARIANT_MAP = {
  success: "var(--success-color)",
  secondary: "var(--secondary-color)",
  accent: "var(--accent-color)",
  danger: "#dc2626",
};

/**
 * Props:
 * - variant: 'success' | 'secondary' | 'accent' | 'danger' (default: 'success')
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
    height: "45px",
    minHeight: "45px",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    borderRadius: "6px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: disabled ? "none" : "0 2px 8px rgba(0, 0, 0, 0.2)",
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`button ${className}`}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
        }
      }}
    >
      {children}
    </button>
  );
}
