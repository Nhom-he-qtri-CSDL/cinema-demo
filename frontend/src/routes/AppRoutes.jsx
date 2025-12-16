import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ScrollToTop from "../components/ScrollToTop";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Movies from "../pages/Movies";
import Shows from "../pages/Shows";
import Seats from "../pages/Seats";
import BookingResult from "../pages/BookingResult";
import MyTickets from "../pages/MyTickets";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows/:movieId" element={<Shows />} />
          <Route path="/seats/:showId" element={<Seats />} />
          <Route path="/booking-result" element={<BookingResult />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
