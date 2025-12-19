package service

import (
	"fmt"

	"cinema.com/demo/internal/model"
	"cinema.com/demo/internal/store"
)

type AuthService interface {
	Login(email, password string) (*model.LoginResponse, error)
	GetUserByID(userID int) (*model.User, error)
	ValidateToken(tokenString string) (*model.User, error)
}

type authService struct {
	userStore  store.UserStore
	jwtService JWTService
}

func NewAuthService(userStore store.UserStore) AuthService {
	return &authService{
		userStore:  userStore,
		jwtService: NewJWTService(),
	}
}

func (s *authService) Login(email, password string) (*model.LoginResponse, error) {
	user, err := s.userStore.GetByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}
	
	// Simple password check (in production, use bcrypt)
	if user.Password != password {
		return nil, fmt.Errorf("invalid credentials")
	}
	
	// Generate JWT token
	token, err := s.jwtService.GenerateToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}
	
	return &model.LoginResponse{
		UserID:   user.UserID,
		Email: user.Email,
		Token:    token,
		Message:  "Login successful",
	}, nil
}

func (s *authService) GetUserByID(userID int) (*model.User, error) {
	return s.userStore.GetByID(userID)
}

func (s *authService) ValidateToken(tokenString string) (*model.User, error) {
	claims, err := s.jwtService.ValidateToken(tokenString)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}
	
	// Get user from database to ensure user still exists
	user, err := s.userStore.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	
	return user, nil
}