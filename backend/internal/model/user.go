package model

type User struct {
	UserID   int    `json:"user_id" db:"user_id"`
	Username string `json:"username" db:"username"`
	Password string `json:"password,omitempty" db:"password"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Message  string `json:"message"`
}