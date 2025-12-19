package service

import (
	"fmt"
	"time"

	"cinema.com/demo/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

// JWT secret key - in production, this should be from environment variable
const jwtSecret = "cinema-booking-secret-key-2024"

// JWT Claims structure
type Claims struct {
	UserID   int    `json:"user_id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// JWTService handles JWT token operations
type JWTService interface {
	GenerateToken(user *model.User) (string, error)
	ValidateToken(tokenString string) (*Claims, error)
}

type jwtService struct{}

func NewJWTService() JWTService {
	return &jwtService{}
}

// GenerateToken creates a new JWT token for the user
func (j *jwtService) GenerateToken(user *model.User) (string, error) {
	// Token expires in 24 hours
	expirationTime := time.Now().Add(24 * time.Hour)
	
	claims := &Claims{
		UserID:   user.UserID,
		Email: user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "cinema-booking-system",
			Subject:   fmt.Sprintf("%d", user.UserID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ValidateToken parses and validates a JWT token
func (j *jwtService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Make sure the signing method is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
