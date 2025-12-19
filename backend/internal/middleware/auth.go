package middleware

import (
	"net/http"
	"strconv"
	"strings"

	"cinema.com/demo/internal/service"
	"github.com/gin-gonic/gin"
)

// JWT-based auth middleware with fallback to X-User-ID header for backward compatibility
func JWTAuthMiddleware(authService service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try JWT token first (Authorization: Bearer <token>)
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			
			user, err := authService.ValidateToken(tokenString)
			if err == nil {
				// JWT token is valid
				c.Set("userID", user.UserID)
				c.Set("user", user)
				c.Next()
				return
			}
			// If JWT validation fails, continue to fallback method
		}
		
		// Fallback to X-User-ID header (for backward compatibility)
		userIDStr := c.GetHeader("X-User-ID")
		if userIDStr == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required", 
				"message": "Please provide either Bearer token or X-User-ID header",
			})
			c.Abort()
			return
		}
		
		userID, err := strconv.Atoi(userIDStr)
		if err != nil || userID <= 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
			c.Abort()
			return
		}
		
		// Validate user exists
		user, err := authService.GetUserByID(userID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}
		
		// Store user info in context
		c.Set("userID", userID)
		c.Set("user", user)
		c.Next()
	}
}

// CORS middleware for frontend integration
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, X-User-ID, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}