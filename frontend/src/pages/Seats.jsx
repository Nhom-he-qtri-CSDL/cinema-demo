import React from "react";
import { useParams } from "react-router-dom";

const Seats = () => {
  const { showId } = useParams();

  return (
    <div style={{ padding: "40px", textAlign: "center", minHeight: "60vh" }}>
      <h1>Seat Selection for Show {showId}</h1>
      <p>Seat map and selection interface will be displayed here</p>
    </div>
  );
};

export default Seats;
