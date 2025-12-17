package controller

import (
	"log"
	"net/http"

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

// BookSeat handles seat booking requests
// POST /book
// This is where concurrent users will compete for the same seat!
func (bc *BookingController) BookSeat(c *gin.Context) {
	// Get user ID from middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	
	var req model.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}
	
	log.Printf("Booking attempt: User %d trying to book seat %d", userID.(int), req.SeatID)
	
	// This is where the concurrency control magic happens!
	// Multiple requests may arrive simultaneously for the same seat
	response, err := bc.bookingService.BookSeat(userID.(int), req.SeatID)
	if err != nil {
		log.Printf("Booking failed for user %d, seat %d: %v", userID.(int), req.SeatID, err)
		
		// Check if it's a concurrency conflict
		if err.Error() == "seat is no longer available - already booked by another user" {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Seat is no longer available",
				"message": "Another user has already booked this seat. Please select a different seat.",
			})
			return
		}
		
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	log.Printf("Booking successful for user %d, seat %d", userID.(int), req.SeatID)
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