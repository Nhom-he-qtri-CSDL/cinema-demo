import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import "../styles/shows.css";

const Shows = () => {
  const { user } = useContext(AuthContext);
  const { setCurrentShow } = useContext(BookingContext);
  const navigate = useNavigate();
  const { movieId } = useParams();

  // Demo shows data
  const shows = [
    {
      id: 1,
      date: "2024-12-16",
      time: "10:00 AM",
      format: "2D",
      theater: "Theater 1",
      availableSeats: 45,
    },
    {
      id: 2,
      date: "2024-12-16",
      time: "01:30 PM",
      format: "3D",
      theater: "Theater 2",
      availableSeats: 32,
    },
    {
      id: 3,
      date: "2024-12-16",
      time: "05:00 PM",
      format: "2D",
      theater: "Theater 3",
      availableSeats: 28,
    },
    {
      id: 4,
      date: "2024-12-16",
      time: "08:30 PM",
      format: "3D",
      theater: "Theater 1",
      availableSeats: 15,
    },
  ];

  const handleSelectShow = (show) => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Store complete show information
    setCurrentShow(show);
    navigate(`/seats/${show.id}`);
  };

  return (
    <div className="shows-page">
      <div className="shows-container">
        <h1>Select a Showtime</h1>
        <p className="shows-subtitle">
          Choose your preferred show for Movie ID: {movieId}
        </p>

        <div className="shows-grid">
          {shows.map((show) => (
            <div key={show.id} className="show-card">
              <div className="show-header">
                <span className="show-date">{show.date}</span>
                <span className="show-format">{show.format}</span>
              </div>

              <div className="show-details">
                <h3 className="show-time">{show.time}</h3>
                <p className="show-theater">Theater: {show.theater}</p>
                <p className="show-seats">
                  <span className="seats-available">{show.availableSeats}</span>{" "}
                  Seats Available
                </p>
              </div>

              <button
                className="btn-select-show"
                onClick={() => handleSelectShow(show)}
                disabled={show.availableSeats === 0}
              >
                {show.availableSeats > 0 ? "Select Show" : "Sold Out"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shows;
