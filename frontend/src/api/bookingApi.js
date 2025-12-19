import axiosClient from "./axiosClient";

const bookingApi = {
  bookSeat: (seatId) => {
    return axiosClient.post("/book", {
      seat_id: seatId,
    });
  },

  getMyBookings: () => {
    return axiosClient.get("/my-bookings");
  },
};

export default bookingApi;
