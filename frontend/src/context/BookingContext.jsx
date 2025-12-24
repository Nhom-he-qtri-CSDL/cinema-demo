/* @refresh reset */
import React, { createContext, useState, useCallback } from "react";

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
  const [tickets, setTickets] = useState([]);

  const addSeat = useCallback((seatId) => {
    setSelectedSeats((prev) => {
      if (!prev.includes(seatId)) {
        return [...prev, seatId];
      }
      return prev;
    });
  }, []);

  const removeSeat = useCallback((seatId) => {
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
  }, []);

  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const updateBooking = useCallback((data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  }, []);

  const saveTicket = useCallback((ticketData) => {
    const newTicket = {
      id: Date.now(),
      movieName: ticketData.movie?.title || "Phim demo",
      showTime: `${ticketData.show?.time || ""} ngày ${
        ticketData.show?.date || ""
      }`,
      seats: ticketData.seats || [],
      customerName:
        ticketData.user?.username || ticketData.user?.email || "Khách hàng",
      bookingDate:
        ticketData.bookingDate || new Date().toLocaleDateString("vi-VN"),
      totalPrice: ticketData.totalPrice || 0,
      theater: ticketData.show?.theater || "",
      format: ticketData.show?.format || "",
    };
    setTickets((prev) => [newTicket, ...prev]);
  }, []);

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
        tickets,
        saveTicket,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
