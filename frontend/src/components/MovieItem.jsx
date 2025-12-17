import React from "react";

const MovieItem = ({ movie, onShowtimeClick }) => {
  return (
    <div id={`movie-${movie.id}`} className="movie-item">
      <div className="movie-poster-section">
        <img
          src={movie.image}
          alt={movie.title}
          className="movie-poster-image"
        />
      </div>

      <div className="movie-details-section">
        <div className="movie-header">
          <h2>{movie.title}</h2>
        </div>

        <div className="movie-quick-info">
          <span className="rating">⭐ {movie.rating}</span>
          <span className="duration">🎬 {movie.duration}</span>
        </div>

        <div className="movie-metadata">
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p>
            <strong>Release:</strong> {movie.releaseDate}
          </p>
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Cast:</strong> {movie.cast}
          </p>
        </div>

        <div className="movie-description">
          <p>{movie.description}</p>
        </div>

        {movie.showtimes && movie.showtimes.length > 0 && (
          <div className="showtimes-section">
            <h4>Showtimes</h4>
            <div className="showtimes-grid">
              {movie.showtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  className="showtime-btn"
                  onClick={() => onShowtimeClick(movie.id, showtime.id)}
                >
                  <span className="time">{showtime.time}</span>
                  <span className="type">{showtime.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieItem;
