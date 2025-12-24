import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import showApi from "../api/showApi";
import "../styles/shows.css";

const Shows = () => {
  const { user } = useContext(AuthContext);
  const { setCurrentShow } = useContext(BookingContext);
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shows from backend
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const response = await showApi.getShows(movieId);
        setShows(response.shows || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching shows:", err);
        setError("Không thể tải danh sách suất chiếu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchShows();
    }
  }, [movieId]);

  const handleSelectShow = (show) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Transform show data for context
    const showDate = new Date(show.show_time);
    const showInfo = {
      show_id: show.show_id,
      movie_id: show.movie_id,
      movie_title: show.movie_title || "Unknown Movie",
      time: showDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: showDate.toLocaleDateString("vi-VN"),
      format: "2D",
      theater: "Theater 1",
      show_time: show.show_time,
    };

    setCurrentShow(showInfo);
    navigate(`/seats/${show.show_id}`);
  };

  if (loading) {
    return (
      <div className="shows-page">
        <div className="shows-container">
          <p
            style={{
              textAlign: "center",
              padding: "50px",
              fontSize: "18px",
              color: "#00d4ff",
            }}
          >
            Đang tải danh sách suất chiếu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shows-page">
        <div className="shows-container">
          <p
            style={{
              textAlign: "center",
              padding: "50px",
              fontSize: "18px",
              color: "#ff4444",
            }}
          >
            {error}
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => navigate("/movies")}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Quay lại danh sách phim
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shows-page">
      <div className="shows-container">
        <h1>Select a Showtime</h1>
        <p className="shows-subtitle">
          Choose your preferred show for Movie ID: {movieId}
        </p>

        {shows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
            <p>Không có suất chiếu nào cho phim này.</p>
            <button
              onClick={() => navigate("/movies")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Quay lại danh sách phim
            </button>
          </div>
        ) : (
          <div className="shows-grid">
            {shows.map((show) => {
              const showDate = new Date(show.show_time);

              return (
                <div key={show.show_id} className="show-card">
                  <div className="show-header">
                    <span className="show-date">
                      {showDate.toLocaleDateString("vi-VN")}
                    </span>
                    <span className="show-format">2D</span>
                  </div>

                  <div className="show-details">
                    <h3 className="show-time">
                      {showDate.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </h3>
                    <p className="show-theater">Theater: Theater 1</p>
                    <p className="show-seats">
                      <span className="movie-title">
                        {show.movie_title || "Unknown Movie"}
                      </span>
                    </p>
                  </div>

                  <button
                    className="btn-select-show"
                    onClick={() => handleSelectShow(show)}
                  >
                    Select Show
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shows;
