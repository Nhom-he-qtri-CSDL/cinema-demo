package controller

import (
	"net/http"
	"strconv"

	"cinema.com/demo/internal/service"
	"github.com/gin-gonic/gin"
)

type MovieController struct {
	bookingService service.BookingService
}

func NewMovieController(bookingService service.BookingService) *MovieController {
	return &MovieController{
		bookingService: bookingService,
	}
}

// GetMovies returns all available movies
// GET /movies
func (mc *MovieController) GetMovies(c *gin.Context) {
	movies, err := mc.bookingService.GetMovies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movies"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"movies": movies})
}

// GetShows returns showtimes for a specific movie or all shows
// GET /shows?movie_id=1
func (mc *MovieController) GetShows(c *gin.Context) {
	movieIDStr := c.Query("movie_id")
	movieID := 0
	
	if movieIDStr != "" {
		var err error
		movieID, err = strconv.Atoi(movieIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
			return
		}
	}
	
	shows, err := mc.bookingService.GetShows(movieID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shows"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"shows": shows})
}

// GetSeats returns seat availability for a specific show
// GET /seats?show_id=1
func (mc *MovieController) GetSeats(c *gin.Context) {
	showIDStr := c.Query("show_id")
	if showIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "show_id is required"})
		return
	}
	
	showID, err := strconv.Atoi(showIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid show ID"})
		return
	}
	
	seats, err := mc.bookingService.GetSeats(showID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch seats"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"seats": seats})
}