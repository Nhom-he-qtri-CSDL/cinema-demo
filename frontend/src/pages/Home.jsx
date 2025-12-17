import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import MovieCard from "../components/MovieCard";
import Snow from "../components/Snow";
import "../styles/home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Demo movies data
  const featuredMovies = [
    {
      id: 1,
      title: "Avatar: Lửa Và Tro Tàn",
      image: "../../public/assets/images/film/avatar.jpg",
      rating: 8.5,
      genre: "Giả tưởng, Hành động",
      duration: "197 min",
    },
    {
      id: 2,
      title: "Phi Vụ Động Trời 2",
      image: "../../public/assets/images/film/zootopia.jpg",
      rating: 7.8,
      genre: "Action",
      duration: "145 min",
    },
    {
      id: 3,
      title: "Thế Hệ Kỳ Tích",
      image: "../../public/assets/images/film/the-he-ki-tich.jpg",
      rating: 8.2,
      genre: "Tâm lý",
      duration: "138 min",
    },
    {
      id: 4,
      title: "Chân Trời Rực Rỡ",
      image: "../../public/assets/images/film/ctrr.jpg",
      rating: 8.0,
      genre: "Tài liệu",
      duration: "85 min",
    },
    {
      id: 5,
      title: "Anh Trai Tôi Là Khủng Long: Tương Lai Của Quá Khứ",
      image: "../../public/assets/images/film/anh-trai-toi-la-khung-long.jpg",
      rating: 7.9,
      genre: "Giả tưởng, Hành động",
      duration: "120 min",
    },
    {
      id: 6,
      title: "Kumanthong Nhật Bản: Vong Nhi Cúp Bế",
      image: "../../public/assets/images/film/kumathong-japan.jpg",
      genre: "Kinh dị",
      duration: "156 min",
    },
  ];

  const handleBooking = (movieId) => {
    navigate(`/movies?id=${movieId}`);
  };

  return (
    <div className="home-page">
      <Snow />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Cinematic Moments</h1>
          <p className="hero-subtitle">
            Discover and book your next movie experience
          </p>
          <div className="hero-buttons">
            {user ? (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/movies")}
              >
                Browse All Movies
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Sign In to Book
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/movies")}
                >
                  Browse Movies
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Welcome Message */}
      {user && (
        <div className="welcome-banner">
          <span>
            Welcome back, <strong>{user.fullName}</strong>!
          </span>
        </div>
      )}

      {/* Featured Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Movies</h2>
        </div>

        <div className="movies-grid">
          {featuredMovies.map((movie) => (
            <div key={movie.id} className="movie-card-wrapper">
              <div className="movie-card-container">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div
                  className="movie-overlay"
                  onClick={() => handleBooking(movie.id)}
                >
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="rating">⭐ {movie.rating}</span>
                      <span className="genre">{movie.genre}</span>
                    </div>
                    <p className="duration">🎬 {movie.duration}</p>
                  </div>
                  <button
                    className="btn-book"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking(movie.id);
                    }}
                  >
                    {user ? "Book Now" : "Sign In to Book"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="cta-section">
        <div className="cta-content">
          <h2>🎄 Chrismast Voucher is waiting for you 🎄</h2>
          <p className="promo-subtitle">Lots of gifts here!!!!!</p>

          <div className="promo-grid">
            <div className="promo-card">
              <div className="promo-icon">🎬</div>
              <h3>Mua 3 Tặng 1</h3>
              <p>Mua 3 vé, tặng 1 vé miễn phí cho phim bất kỳ</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">🍿</div>
              <h3>Bắp & Nước Giảm 30%</h3>
              <p>Tất cả đồ ăn nhẹ và đồ uống giảm 30% ngay hôm nay</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">🎁</div>
              <h3>Quà Tặng Bí Ẩn</h3>
              <p>Mỗi khách hàng mới được nhận quà ngẫu nhiên</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">⭐</div>
              <h3>Điểm Thưởng Gấp Đôi</h3>
              <p>Tích điểm gấp 2 lần cho mỗi vé đặt mua</p>
            </div>
          </div>

          {!user ? (
            <>
              <p className="cta-call-to-action">
                Đăng nhập ngay để nhận ưu đãi!
              </p>
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/login")}
              >
                Đăng Nhập Ngay
              </button>
            </>
          ) : (
            <>
              <p className="cta-call-to-action">
                Chọn phim yêu thích của bạn ngay!
              </p>
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/movies")}
              >
                Xem Tất Cả Phim
              </button>
            </>
          )}
        </div>
      </section> */}
    </div>
  );
};

export default Home;
