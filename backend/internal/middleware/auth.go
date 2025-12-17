package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Simple session-based auth middleware
// In production, use JWT or proper session management
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user_id from session/header (simple approach for demo)
		userIDStr := c.GetHeader("X-User-ID")
		if userIDStr == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user ID header"})
			c.Abort()
			return
		}
		
		userID, err := strconv.Atoi(userIDStr)
		if err != nil || userID <= 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
			c.Abort()
			return
		}
		
		// Store user ID in context for use in handlers
		c.Set("userID", userID)
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