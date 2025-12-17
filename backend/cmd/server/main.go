package main

import (
	"log"

	"cinema.com/demo/internal/controller"
	"cinema.com/demo/internal/db"
	"cinema.com/demo/internal/middleware"
	"cinema.com/demo/internal/service"
	"cinema.com/demo/internal/store"
	"github.com/gin-gonic/gin"
)

func main() {
	// Database connection
	dbConfig := db.DefaultConfig()
	database, err := db.NewConnection(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Initialize stores (repository layer)
	userStore := store.NewUserStore(database)
	movieStore := store.NewMovieStore(database)
	seatStore := store.NewSeatStore(database)

	// Initialize services (business logic layer)
	authService := service.NewAuthService(userStore)
	bookingService := service.NewBookingService(database, movieStore, seatStore)

	// Initialize controllers (HTTP handlers)
	authController := controller.NewAuthController(authService)
	movieController := controller.NewMovieController(bookingService)
	bookingController := controller.NewBookingController(bookingService)

	// Setup Gin router
	router := gin.Default()

	// Add middleware
	router.Use(middleware.CORSMiddleware())

	// Public routes (no authentication required)
	public := router.Group("/api")
	{
		public.POST("/login", authController.Login)
		public.GET("/movies", movieController.GetMovies)
		public.GET("/shows", movieController.GetShows)
		public.GET("/seats", movieController.GetSeats)
	}

	// Protected routes (authentication required)
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// CRITICAL ENDPOINT: This is where concurrency control is tested
		// Multiple users can simultaneously try to book the same seat
		protected.POST("/book", bookingController.BookSeat)
		protected.GET("/my-bookings", bookingController.GetMyBookings)
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Cinema Booking API is running"})
	})

	log.Println("🎬 Cinema Booking API Server starting...")
	log.Println("📚 This demo showcases database-level concurrency control")
	log.Println("🔒 Multiple concurrent booking requests will be handled safely by PostgreSQL")
	log.Println("🚀 Server running on http://localhost:8080")
	log.Println("")
	log.Println("API Endpoints:")
	log.Println("POST /api/login           - User authentication")
	log.Println("GET  /api/movies          - List all movies")
	log.Println("GET  /api/shows?movie_id= - List shows for movie")
	log.Println("GET  /api/seats?show_id=  - Get seat availability")
	log.Println("POST /api/book            - Book a seat (requires auth)")
	log.Println("GET  /api/my-bookings     - Get user's bookings (requires auth)")
	log.Println("")
	log.Println("🧪 To test concurrency:")
	log.Println("1. Make multiple simultaneous POST /api/book requests for the same seat")
	log.Println("2. Only ONE request should succeed, others should get 409 Conflict")
	log.Println("3. This demonstrates PostgreSQL's atomic transaction handling")

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}