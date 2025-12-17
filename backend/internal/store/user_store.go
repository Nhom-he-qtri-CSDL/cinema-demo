package store

import (
	"database/sql"
	"fmt"

	"cinema.com/demo/internal/model"
)

type UserStore interface {
	GetByUsername(username string) (*model.User, error)
	GetByID(userID int) (*model.User, error)
}

type userStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) UserStore {
	return &userStore{db: db}
}

func (s *userStore) GetByUsername(username string) (*model.User, error) {
	query := `SELECT user_id, username, password FROM users WHERE username = $1`
	
	var user model.User
	err := s.db.QueryRow(query, username).Scan(
		&user.UserID,
		&user.Username,
		&user.Password,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	
	return &user, nil
}

func (s *userStore) GetByID(userID int) (*model.User, error) {
	query := `SELECT user_id, username, password FROM users WHERE user_id = $1`
	
	var user model.User
	err := s.db.QueryRow(query, userID).Scan(
		&user.UserID,
		&user.Username,
		&user.Password,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	
	return &user, nil
}