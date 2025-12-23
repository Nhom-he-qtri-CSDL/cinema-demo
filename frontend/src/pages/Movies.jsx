import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import movieApi from "../api/movieApi";
import showApi from "../api/showApi";
import "../styles/movies.css";

const Movies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState("Tất Cả");
  const movieIdFromHome = searchParams.get("id");
  const [allMovies, setAllMovies] = useState([]);
  const [moviesWithShows, setMoviesWithShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getMovies();
        const movies = response.movies || [];
        setAllMovies(movies);

        // Fetch shows for each movie
        const moviesWithShowsData = await Promise.all(
          movies.map(async (movie) => {
            try {
              const showsResponse = await showApi.getShows(movie.movie_id);
              return {
                ...movie,
                showtimes: showsResponse.shows || [],
              };
            } catch (error) {
              console.error(
                `Error fetching shows for movie ${movie.movie_id}:`,
                error
              );
              return {
                ...movie,
                showtimes: [],
              };
            }
          })
        );

        setMoviesWithShows(moviesWithShowsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Scroll to specific movie
  useEffect(() => {
    if (movieIdFromHome && moviesWithShows.length > 0) {
      setTimeout(() => {
        const movieElement = document.getElementById(
          `movie-${movieIdFromHome}`
        );
        if (movieElement) {
          movieElement.scrollIntoView({ behavior: "smooth", block: "center" });
          movieElement.style.boxShadow = "0 0 30px rgba(0, 212, 255, 0.6)";
          setTimeout(() => {
            movieElement.style.boxShadow = "";
          }, 3000);
        }
      }, 100);
    }
  }, [movieIdFromHome, moviesWithShows]);

  // Get unique genres from backend data
  const genres = [
    "Tất Cả",
    ...new Set(
      moviesWithShows
        .map((m) => m.genre)
        .filter(Boolean)
        .flatMap((g) => g.split(",").map((genre) => genre.trim()))
    ),
  ];

  // Filter movies
  const filteredMovies =
    selectedGenre === "Tất Cả"
      ? moviesWithShows
      : moviesWithShows.filter((movie) => movie.genre?.includes(selectedGenre));

  const handleShowtimeClick = (movie, showtime) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/shows/${movie.movie_id}`);
    }
  };

  if (loading) {
    return (
      <div className="movies-page">
        <div
          className="loading-container"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <p style={{ fontSize: "18px", color: "#00d4ff" }}>
            Đang tải danh sách phim...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-page">
        <div
          className="error-container"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <p style={{ fontSize: "18px", color: "#ff4444" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <h3>Thể Loại:</h3>
          <div className="genre-filters">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`filter-btn ${
                  selectedGenre === genre ? "active" : ""
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="movies-container">
        <div className="movies-list">
          {filteredMovies.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#999" }}
            >
              <p>Không tìm thấy phim nào.</p>
            </div>
          ) : (
            filteredMovies.map((movie) => (
              <div
                key={movie.movie_id}
                id={`movie-${movie.movie_id}`}
                className="movie-item"
              >
                {/* Left Side - Poster */}
                <div className="movie-poster-section">
                  <img
                    src={
                      movie.poster_url ||
                      "../../public/assets/images/film/avatar.jpg"
                    }
                    alt={movie.title}
                    className="movie-poster-image"
                    onError={(e) => {
                      e.target.src =
                        "../../public/assets/images/film/avatar.jpg";
                    }}
                  />
                </div>

                {/* Right Side - Info & Showtimes */}
                <div className="movie-details-section">
                  <div className="movie-header">
                    <h2>{movie.title}</h2>
                    <div className="movie-quick-info">
                      {movie.rating && (
                        <span className="rating">⭐ {movie.rating}/10</span>
                      )}
                      {movie.duration && (
                        <span className="duration">
                          ⏱️ {movie.duration} phút
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="movie-metadata">
                    {movie.genre && (
                      <p>
                        <strong>Thể Loại:</strong> {movie.genre}
                      </p>
                    )}
                    {movie.director && (
                      <p>
                        <strong>Đạo Diễn:</strong> {movie.director}
                      </p>
                    )}
                    {movie.cast && (
                      <p>
                        <strong>Diễn Viên:</strong> {movie.cast}
                      </p>
                    )}
                    {movie.release_date && (
                      <p>
                        <strong>Ngày Phát Hành:</strong>{" "}
                        {new Date(movie.release_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    )}
                  </div>

                  {movie.description && (
                    <div className="movie-description">
                      <p>{movie.description}</p>
                    </div>
                  )}

                  {/* Showtimes */}
                  <div className="showtimes-section">
                    <h4>Khung Giờ Chiếu:</h4>
                    {movie.showtimes && movie.showtimes.length > 0 ? (
                      <div className="showtimes-grid">
                        {movie.showtimes.map((showtime) => (
                          <button
                            key={showtime.show_id}
                            className="showtime-btn"
                            onClick={() => handleShowtimeClick(movie, showtime)}
                          >
                            <span className="time">
                              {new Date(showtime.show_time).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span className="type">
                              {new Date(showtime.show_time).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                }
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "#999", fontSize: "14px" }}>
                        Chưa có suất chiếu
                      </p>
                    )}
                  </div>

                  {!user && (
                    <p className="login-warning">
                      ⚠️ Vui lòng <strong>đăng nhập</strong> để đặt vé
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
