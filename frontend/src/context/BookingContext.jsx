/* @refresh reset */
import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [bookingData, setBookingData] = useState({
    movie: null,
    show: null,
    seats: [],
    totalPrice: 0,
  });

  const addSeat = (seatId) => {
    if (!selectedSeats.includes(seatId)) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const removeSeat = (seatId) => {
    setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const updateBooking = (data) => {
    setBookingData({ ...bookingData, ...data });
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSeats,
        addSeat,
        removeSeat,
        clearSeats,
        currentShow,
        setCurrentShow,
        bookingData,
        updateBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
