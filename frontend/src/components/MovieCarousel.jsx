import React, { useState, useEffect } from "react";
import "../styles/carousel.css";

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const movies = [
    {
      id: 1,
      title: "Avatar: Lửa Và Tro Tàn",
      image: "/assets/images/film/avatar.jpg",
    },
    {
      id: 2,
      title: "Phi Vụ Động Trời 2",
      image: "/assets/images/film/zootopia.jpg",
    },
    {
      id: 3,
      title: "Thế Hệ Kỳ Tích",
      image: "/assets/images/film/the-he-ki-tich.jpg",
    },
    {
      id: 4,
      title: "Chân Trời Rực Rỡ",
      image: "/assets/images/film/ctrr.jpg",
    },
    {
      id: 5,
      title: "Anh Trai Tôi Là Khủng Long",
      image: "/assets/images/film/anh-trai-toi-la-khung-long.jpg",
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isAutoPlay, movies.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);

    // Resume auto-play after 5 seconds
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 5000);
  };

  const getSlidePosition = (index) => {
    const diff = index - currentIndex;
    if (diff > 2) return diff - movies.length;
    if (diff < -2) return diff + movies.length;
    return diff;
  };

  return (
    <div className="movie-carousel">
      <div className="carousel-container">
        <div className="carousel-track">
          {movies.map((movie, index) => {
            const position = getSlidePosition(index);
            return (
              <div
                key={movie.id}
                className={`carousel-slide ${
                  index === currentIndex ? "active" : ""
                }`}
                style={{ "--position": position }}
              >
                <img src={movie.image} alt={movie.title} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-dots">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>

      <div
        className="carousel-title"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <h3>{movies[currentIndex].title}</h3>
      </div>
    </div>
  );
};

export default MovieCarousel;
