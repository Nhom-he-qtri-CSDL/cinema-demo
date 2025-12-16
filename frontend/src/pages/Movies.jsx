import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/movies.css";

const Movies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState("Tất Cả");
  const movieIdFromHome = searchParams.get("id");

  // Scroll to specific movie
  useEffect(() => {
    if (movieIdFromHome) {
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
  }, [movieIdFromHome]);

  // Demo movies data with showtimes
  const allMovies = [
    {
      id: 1,
      title: "Avatar: Lửa Và Tro Tàn",
      image: "../../public/assets/images/film/avatar.jpg",
      rating: 8.5,
      genre: "Giả tưởng, Hành động",
      duration: "197 min",
      releaseDate: "2024-12-15",
      director: "James Cameron",
      cast: "Sam Worthington, Zoe Saldana",
      description:
        "Tiếp tục cuộc phiêu lưu trên hành tinh Pandora, Jake Sully và nhóm của anh ta phải đối mặt với những thách thức mới.",
      showtimes: [
        { id: 1, time: "10:00 AM", type: "2D" },
        { id: 2, time: "01:30 PM", type: "3D" },
        { id: 3, time: "05:00 PM", type: "2D" },
        { id: 4, time: "08:30 PM", type: "3D" },
      ],
    },
    {
      id: 2,
      title: "Phi Vụ Động Trời 2",
      image: "../../public/assets/images/film/zootopia.jpg",
      rating: 7.8,
      genre: "Hành động, Phiêu lưu",
      duration: "145 min",
      releaseDate: "2024-11-20",
      director: "Christopher McQuarrie",
      cast: "Tom Cruise, Miles Teller",
      description:
        "Ethan Hunt và đội ngũ của anh tiếp tục cuộc chiến chống lại những kẻ thù nguy hiểm.",
      showtimes: [
        { id: 1, time: "09:30 AM", type: "2D" },
        { id: 2, time: "12:45 PM", type: "2D" },
        { id: 3, time: "04:15 PM", type: "3D" },
        { id: 4, time: "07:45 PM", type: "2D" },
        { id: 5, time: "10:15 PM", type: "3D" },
      ],
    },
    {
      id: 3,
      title: "Thế Hệ Kỳ Tích",
      image: "../../public/assets/images/film/the-he-ki-tich.jpg",
      rating: 8.2,
      genre: "Tâm lý, Chính kịch",
      duration: "138 min",
      releaseDate: "2024-10-10",
      director: "Various",
      cast: "Vietnamese Actors",
      description:
        "Câu chuyện cảm động về một thế hệ trẻ và những giấc mơ của họ.",
      showtimes: [
        { id: 1, time: "11:00 AM", type: "2D" },
        { id: 2, time: "02:30 PM", type: "2D" },
        { id: 3, time: "06:00 PM", type: "2D" },
      ],
    },
    {
      id: 4,
      title: "Chân Trời Rực Rỡ",
      image: "../../public/assets/images/film/ctrr.jpg",
      rating: 8.0,
      genre: "Tài liệu",
      duration: "85 min",
      releaseDate: "2024-12-01",
      director: "Documentary Team",
      cast: "Various",
      description:
        "Một cuộc hành trình tài liệu khám phá những kỳ tích của thiên nhiên.",
      showtimes: [
        { id: 1, time: "10:30 AM", type: "2D" },
        { id: 2, time: "03:00 PM", type: "2D" },
      ],
    },
    {
      id: 5,
      title: "Anh Trai Tôi Là Khủng Long",
      image: "../../public/assets/images/film/anh-trai-toi-la-khung-long.jpg",
      rating: 7.9,
      genre: "Giả tưởng, Hành động",
      duration: "120 min",
      releaseDate: "2024-11-15",
      director: "Vietnamese Director",
      cast: "Vietnamese Actors",
      description:
        "Một bộ phim giả tưởng hài hước về anh trai là một chú khủng long.",
      showtimes: [
        { id: 1, time: "10:00 AM", type: "2D" },
        { id: 2, time: "01:00 PM", type: "2D" },
        { id: 3, time: "04:30 PM", type: "2D" },
        { id: 4, time: "07:30 PM", type: "2D" },
      ],
    },
    {
      id: 6,
      title: "Kumanthong Nhật Bản: Vong Nhi Cúp Bế",
      image: "../../public/assets/images/film/kumathong-japan.jpg",
      rating: 7.5,
      genre: "Kinh dị, Tâm linh",
      duration: "156 min",
      releaseDate: "2024-12-05",
      director: "Horror Master",
      cast: "Asian Actors",
      description:
        "Một bộ phim kinh dị với những yếu tố tâm linh từ các nền văn hóa Á Đông.",
      showtimes: [
        { id: 1, time: "06:00 PM", type: "2D" },
        { id: 2, time: "09:00 PM", type: "2D" },
      ],
    },
  ];

  // Get unique genres
  const genres = [
    "Tất Cả",
    ...new Set(allMovies.flatMap((m) => m.genre.split(", "))),
  ];

  // Filter movies
  const filteredMovies =
    selectedGenre === "Tất Cả"
      ? allMovies
      : allMovies.filter((movie) => movie.genre.includes(selectedGenre));

  const handleShowtimeClick = (movie, showtime) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/shows/${movie.id}`);
    }
  };

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
          {filteredMovies.map((movie) => (
            <div key={movie.id} id={`movie-${movie.id}`} className="movie-item">
              {/* Left Side - Poster */}
              <div className="movie-poster-section">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-poster-image"
                />
              </div>

              {/* Right Side - Info & Showtimes */}
              <div className="movie-details-section">
                <div className="movie-header">
                  <h2>{movie.title}</h2>
                  <div className="movie-quick-info">
                    <span className="rating">⭐ {movie.rating}/10</span>
                    <span className="duration">⏱️ {movie.duration}</span>
                  </div>
                </div>

                <div className="movie-metadata">
                  <p>
                    <strong>Thể Loại:</strong> {movie.genre}
                  </p>
                  <p>
                    <strong>Đạo Diễn:</strong> {movie.director}
                  </p>
                  <p>
                    <strong>Diễn Viên:</strong> {movie.cast}
                  </p>
                  <p>
                    <strong>Ngày Phát Hành:</strong> {movie.releaseDate}
                  </p>
                </div>

                <div className="movie-description">
                  <p>{movie.description}</p>
                </div>

                {/* Showtimes */}
                <div className="showtimes-section">
                  <h4>Khung Giờ Chiếu Hôm Nay:</h4>
                  <div className="showtimes-grid">
                    {movie.showtimes.map((showtime) => (
                      <button
                        key={showtime.id}
                        className="showtime-btn"
                        onClick={() => handleShowtimeClick(movie, showtime)}
                      >
                        <span className="time">{showtime.time}</span>
                        <span className="type">{showtime.type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {!user && (
                  <p className="login-warning">
                    ⚠️ Vui lòng <strong>đăng nhập</strong> để đặt vé
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;
