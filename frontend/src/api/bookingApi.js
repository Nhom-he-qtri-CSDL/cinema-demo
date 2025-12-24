import axiosClient from "./axiosClient";

const bookingApi = {
  bookSeat: (seatId) => {
    return axiosClient.post("/book", {
      seat_id: seatId,
    });
  },
  bookMultipleSeats: (showId, seatNames) => {
    if (!showId) {
      return Promise.reject(new Error("showId is required"));
    }
    if (!seatNames || seatNames.length === 0) {
      return Promise.reject(new Error("At least 1 seat must be selected"));
    }
    if (!Array.isArray(seatNames)) {
      return Promise.reject(new Error("seatNames must be an array"));
    }

    return axiosClient.post("/book", {
      show_id: showId,
      seats: seatNames, // Array: ["A5", "A6", "A7"]
    });
  },

  getMyBookings: () => {
    return axiosClient.get("/my-bookings");
  },

  cancelBooking: (bookingId) => {
    if (!bookingId) {
      return Promise.reject(new Error("bookingId is required"));
    }
    return axiosClient.delete(`/cancel/${bookingId}`);
  },
};

export default bookingApi;
