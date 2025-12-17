package service

import (
	"fmt"

	"cinema.com/demo/internal/model"
	"cinema.com/demo/internal/store"
)

type AuthService interface {
	Login(username, password string) (*model.LoginResponse, error)
	GetUserByID(userID int) (*model.User, error)
}

type authService struct {
	userStore store.UserStore
}

func NewAuthService(userStore store.UserStore) AuthService {
	return &authService{
		userStore: userStore,
	}
}

func (s *authService) Login(username, password string) (*model.LoginResponse, error) {
	user, err := s.userStore.GetByUsername(username)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}
	
	// Simple password check (in production, use bcrypt)
	if user.Password != password {
		return nil, fmt.Errorf("invalid credentials")
	}
	
	return &model.LoginResponse{
		UserID:   user.UserID,
		Username: user.Username,
		Message:  "Login successful",
	}, nil
}

func (s *authService) GetUserByID(userID int) (*model.User, error) {
	return s.userStore.GetByID(userID)
}