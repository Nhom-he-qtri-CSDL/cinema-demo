package store

import (
	"database/sql"
	"fmt"

	"cinema.com/demo/internal/model"
)

type UserStore interface {
	GetByEmail(email string) (*model.User, error) // username sẽ thực tế là email
	GetByID(userID int) (*model.User, error)
}

type userStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) UserStore {
	return &userStore{db: db}
}

func (s *userStore) GetByEmail(email string) (*model.User, error) {
	// Tìm user bằng email (username thực tế là email được gửi từ frontend)
	query := `SELECT user_id, email, password FROM users WHERE email = $1`
	
	var user model.User
	err := s.db.QueryRow(query, email).Scan(
		&user.UserID,
		&user.Email,
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
	query := `SELECT user_id, email, password FROM users WHERE user_id = $1`
	
	var user model.User
	err := s.db.QueryRow(query, userID).Scan(
		&user.UserID,
		&user.Email,
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