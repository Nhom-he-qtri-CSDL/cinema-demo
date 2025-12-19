package model

type User struct {
	UserID   int    `json:"user_id" db:"user_id"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password,omitempty" db:"password"`
}

type LoginRequest struct {
	Email string `json:"email" binding:"required"` // Giữ username để tương thích, nhưng thực tế sẽ là email
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	UserID   int    `json:"user_id"`
	Email    string `json:"email"`
	Token    string `json:"token"`
	Message  string `json:"message"`
}