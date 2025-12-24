package controller

import (
	"fmt"
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

// CancelBooking handles booking cancellation requests
// DELETE /cancel/:bookingId
func (bc *BookingController) CancelBooking(c *gin.Context) {
	// Get user ID from middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	
	// Get booking ID from URL parameter
	bookingID := c.Param("bookingId")
	if bookingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking_id is required"})
		return
	}
	
	// Convert to int
	bookingIDInt := 0
	if _, err := fmt.Sscanf(bookingID, "%d", &bookingIDInt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}
	
	log.Printf("User %d attempting to cancel booking %d", userID.(int), bookingIDInt)
	
	// Call service to cancel booking
	err := bc.bookingService.CancelBooking(userID.(int), bookingIDInt)
	if err != nil {
		log.Printf("Failed to cancel booking %d: %v", bookingIDInt, err)
		
		// Check for authorization errors
		errMsg := err.Error()
		if strings.Contains(errMsg, "unauthorized") || strings.Contains(errMsg, "does not belong") {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Unauthorized to cancel this booking",
				"details": errMsg,
			})
			return
		}
		
		// Other errors
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to cancel booking",
			"details": errMsg,
		})
		return
	}
	
	log.Printf("Successfully cancelled booking %d for user %d", bookingIDInt, userID.(int))
	c.JSON(http.StatusOK, gin.H{
		"message": "Booking cancelled successfully",
		"booking_id": bookingIDInt,
	})
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

