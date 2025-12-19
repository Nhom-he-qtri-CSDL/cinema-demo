package store

import (
    "database/sql"
    "fmt"

    "cinema.com/demo/internal/model"
)

type ShowStore interface {
    GetByID(showID int) (*model.Show, error)
    GetByMovieID(movieID int) ([]model.Show, error)
}

type showStore struct {
    db *sql.DB
}

func NewShowStore(db *sql.DB) ShowStore {
    return &showStore{db: db}
}

// GetByID retrieves show by show ID
func (s *showStore) GetByID(showID int) (*model.Show, error) {
    query := `
        SELECT show_id, movie_id, show_time
        FROM shows
        WHERE show_id = $1
    `
    
    var show model.Show
    err := s.db.QueryRow(query, showID).Scan(
        &show.ShowID,
        &show.MovieID,
        &show.ShowTime,
    )
    
    if err != nil {
        return nil, fmt.Errorf("show not found: %w", err)
    }
    
    return &show, nil
}

// GetByMovieID retrieves all shows for a movie
func (s *showStore) GetByMovieID(movieID int) ([]model.Show, error) {
    query := `
        SELECT show_id, movie_id, show_time
        FROM shows
        WHERE movie_id = $1
        ORDER BY show_time
    `
    
    rows, err := s.db.Query(query, movieID)
    if err != nil {
        return nil, fmt.Errorf("failed to get shows: %w", err)
    }
    defer rows.Close()
    
    var shows []model.Show
    for rows.Next() {
        var show model.Show
        if err := rows.Scan(&show.ShowID, &show.MovieID, &show.ShowTime); err != nil {
            return nil, fmt.Errorf("failed to scan show: %w", err)
        }
        shows = append(shows, show)
    }
    
    return shows, nil
}