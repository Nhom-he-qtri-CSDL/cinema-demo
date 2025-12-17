package store

import (
	"database/sql"
	"fmt"

	"cinema.com/demo/internal/model"
)

type MovieStore interface {
	GetAll() ([]model.Movie, error)
	GetByID(movieID int) (*model.Movie, error)
	GetShows(movieID int) ([]model.ShowWithMovie, error)
	GetAllShows() ([]model.ShowWithMovie, error)
}

type movieStore struct {
	db *sql.DB
}

func NewMovieStore(db *sql.DB) MovieStore {
	return &movieStore{db: db}
}

func (s *movieStore) GetAll() ([]model.Movie, error) {
	query := `SELECT movie_id, title, duration, description FROM movies ORDER BY title`
	
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query movies: %w", err)
	}
	defer rows.Close()
	
	var movies []model.Movie
	for rows.Next() {
		var movie model.Movie
		err := rows.Scan(
			&movie.MovieID,
			&movie.Title,
			&movie.Duration,
			&movie.Description,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan movie: %w", err)
		}
		movies = append(movies, movie)
	}
	
	return movies, nil
}

func (s *movieStore) GetByID(movieID int) (*model.Movie, error) {
	query := `SELECT movie_id, title, duration, description FROM movies WHERE movie_id = $1`
	
	var movie model.Movie
	err := s.db.QueryRow(query, movieID).Scan(
		&movie.MovieID,
		&movie.Title,
		&movie.Duration,
		&movie.Description,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("movie not found")
		}
		return nil, fmt.Errorf("failed to get movie: %w", err)
	}
	
	return &movie, nil
}

func (s *movieStore) GetShows(movieID int) ([]model.ShowWithMovie, error) {
	query := `
		SELECT s.show_id, s.movie_id, s.show_time, m.title
		FROM shows s
		JOIN movies m ON s.movie_id = m.movie_id
		WHERE s.movie_id = $1
		ORDER BY s.show_time`
	
	rows, err := s.db.Query(query, movieID)
	if err != nil {
		return nil, fmt.Errorf("failed to query shows: %w", err)
	}
	defer rows.Close()
	
	var shows []model.ShowWithMovie
	for rows.Next() {
		var show model.ShowWithMovie
		err := rows.Scan(
			&show.ShowID,
			&show.MovieID,
			&show.ShowTime,
			&show.MovieTitle,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan show: %w", err)
		}
		shows = append(shows, show)
	}
	
	return shows, nil
}

func (s *movieStore) GetAllShows() ([]model.ShowWithMovie, error) {
	query := `
		SELECT s.show_id, s.movie_id, s.show_time, m.title
		FROM shows s
		JOIN movies m ON s.movie_id = m.movie_id
		ORDER BY s.show_time`
	
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query shows: %w", err)
	}
	defer rows.Close()
	
	var shows []model.ShowWithMovie
	for rows.Next() {
		var show model.ShowWithMovie
		err := rows.Scan(
			&show.ShowID,
			&show.MovieID,
			&show.ShowTime,
			&show.MovieTitle,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan show: %w", err)
		}
		shows = append(shows, show)
	}
	
	return shows, nil
}