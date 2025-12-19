package controller

import (
	"log"
	"net/http"
	"strings"

	"cinema.com/demo/internal/model"
	"cinema.com/demo/internal/service"
	"github.com/gin-gonic/gin"
)

type BookingController struct {
	bookingService service.BookingService
}

func NewBookingController(bookingService service.BookingService) *BookingController {
	return &BookingController{
		bookingService: bookingService,
	}
}

// BookSeats handles both single and multi-seat booking requests
// POST /book
// UNIFIED ENDPOINT: This is where concurrent users will compete for seats!
func (bc *BookingController) BookSeats(c *gin.Context) {
	// Get user ID from middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	
	var req model.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request format", 
			"details": err.Error(),
		})
		return
	}
	
	// Log booking attempt (works for both single and multi-seat)
	if req.SeatID != nil {
		log.Printf("Single seat booking attempt: User %d trying to book seat %d", 
			userID.(int), *req.SeatID)
	} else {
		log.Printf("Multi-seat booking attempt: User %d trying to book seats %v for show %d", 
			userID.(int), req.SeatNames, req.ShowID)
	}
	
	// CORE CONCURRENCY CONTROL: Unified method handles both booking types
	// Multiple concurrent requests for overlapping seats will be handled safely by PostgreSQL
	response, err := bc.bookingService.BookSeats(userID.(int), &req)
	if err != nil {
		log.Printf("Booking failed for user %d: %v", userID.(int), err)
		
		// Check for concurrency conflicts (works for both single and multi-seat)
		errMsg := err.Error()
		if strings.Contains(errMsg, "seat is no longer available") || 
		   strings.Contains(errMsg, "seats no longer available") ||
		   strings.Contains(errMsg, "concurrent booking detected") {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Seats no longer available",
				"message": "One or more seats have been booked by other users. Please select different seats.",
				"details": errMsg,
			})
			return
		}
		
		// Other errors (validation, database issues, etc.)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Booking failed", 
			"details": errMsg,
		})
		return
	}
	
	log.Printf("Booking successful for user %d", userID.(int))
	c.JSON(http.StatusOK, response)
}

// GetMyBookings returns all bookings for the current user
// GET /my-bookings
func (bc *BookingController) GetMyBookings(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	
	bookings, err := bc.bookingService.GetUserBookings(userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

