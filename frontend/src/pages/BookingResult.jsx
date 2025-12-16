import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BookingResult = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="booking-result-page">
      <div className="result-container">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p className="result-message">
          Your ticket booking has been successfully confirmed.
        </p>

        {user && (
          <div className="booking-details">
            <h2>Booking Details</h2>
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{user.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/movies")}
          >
            Continue Shopping
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/my-tickets")}
          >
            View My Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingResult;
