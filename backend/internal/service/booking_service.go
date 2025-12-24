package service

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"cinema.com/demo/internal/model"
	"cinema.com/demo/internal/store"
)

type BookingService interface {
	GetMovies() ([]model.Movie, error)
	GetShows(movieID int) ([]model.ShowWithMovie, error)
	GetSeats(showID int) ([]model.Seat, error)

	// UNIFIED BOOKING: Handles both single and multi-seat booking
	// Core DBMS concurrency control demonstration
	BookSeats(userID int, req *model.BookingRequest) (*model.BookingResponse, error)

	GetUserBookings(userID int) ([]model.BookingWithDetails, error)

	// Cancel booking and free up seat
	CancelBooking(userID int, bookingID int) error
}

type bookingService struct {
	db         *sql.DB
	movieStore store.MovieStore
	seatStore  store.SeatStore
	showStore  store.ShowStore
}

func NewBookingService(db *sql.DB, movieStore store.MovieStore, seatStore store.SeatStore, showStore store.ShowStore) BookingService {
	return &bookingService{
		db:         db,
		movieStore: movieStore,
		seatStore:  seatStore,
		showStore:  showStore,
	}
}

func (s *bookingService) GetMovies() ([]model.Movie, error) {
	return s.movieStore.GetAll()
}

func (s *bookingService) GetShows(movieID int) ([]model.ShowWithMovie, error) {
	if movieID == 0 {
		return s.movieStore.GetAllShows()
	}
	return s.movieStore.GetShows(movieID)
}

func (s *bookingService) GetSeats(showID int) ([]model.Seat, error) {
	return s.seatStore.GetByShowID(showID)
}

// ==================== UNIFIED BOOKING LOGIC ====================
// BookSeats: Unified method handling both single and multi-seat booking
// Core DBMS concurrency control demonstration - supports both use cases
func (s *bookingService) BookSeats(userID int, req *model.BookingRequest) (*model.BookingResponse, error) {
	// Determine booking type and validate request
	if req.SeatID != nil {
		// Legacy single seat booking (for backward compatibility)
		return s.bookSingleSeat(userID, *req.SeatID)
	} else if req.ShowID > 0 && len(req.SeatNames) > 0 {
		// Multi-seat booking (new unified approach)
		return s.bookMultipleSeats(userID, req.ShowID, req.SeatNames)
	} else {
		return nil, fmt.Errorf("invalid request: must specify either seat_id or (show_id + seats)")
	}
}

// bookSingleSeat: Internal method for single seat booking (legacy support)
func (s *bookingService) bookSingleSeat(userID, seatID int) (*model.BookingResponse, error) {
	// Start a transaction - this ensures ATOMICITY
	tx, err := s.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}

	committed := false

	// IMPORTANT: Always rollback on error to release locks
	defer func() {
		if !committed {
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("Failed to rollback transaction: %v", rbErr)
			}
		}
	}()

	// Get seat info first (for response data)
	seat, err := s.seatStore.GetByID(seatID)
	if err != nil {
		return nil, fmt.Errorf("seat not found: %w", err)
	}

	log.Printf("User %d attempting to book seat %d (%s) - Current status: %s",
		userID, seatID, seat.SeatName, seat.Status)

	// CONCURRENCY CONTROL: Optimistic locking approach
	// Try to update seat from AVAILABLE to BOOKED
	// This will FAIL if another transaction already booked the seat
	success, err := s.seatStore.UpdateSeatStatusInTx(
		tx,
		seatID,
		model.SeatStatusBooked,
		model.SeatStatusAvailable,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update seat status: %w", err)
	}

	// If update affected 0 rows, the seat was already booked
	if !success {
		log.Printf("Concurrency conflict detected: Seat %d already booked by another user", seatID)
		return nil, fmt.Errorf("seat is no longer available - already booked by another user")
	}

	// Create booking record
	bookingID, err := s.seatStore.CreateBookingInTx(tx, userID, seatID)
	if err != nil {
		return nil, fmt.Errorf("failed to create booking: %w", err)
	}

	// Commit the transaction - makes changes permanent
	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	committed = true

	log.Printf("SUCCESS: User %d booked seat %d (%s), booking ID: %d",
		userID, seatID, seat.SeatName, bookingID)

	// Get movie and show details for response
	show, movie, err := s.getShowAndMovieDetails(seat.ShowID)
	if err != nil {
		// Booking was successful, just return basic info
		log.Printf("Warning: Could not get movie details for response: %v", err)
		bookingIDPtr := bookingID
		return &model.BookingResponse{
			BookingID: &bookingIDPtr,
			SeatName:  seat.SeatName,
			Message:   "Seat booked successfully",
		}, nil
	}

	bookingIDPtr := bookingID
	return &model.BookingResponse{
		BookingID:  &bookingIDPtr,
		SeatName:   seat.SeatName,
		MovieTitle: movie.Title,
		ShowTime:   show.ShowTime.Format("2006-01-02 15:04"),
		Message: fmt.Sprintf("Seat %s booked successfully for %s at %s",
			seat.SeatName, movie.Title, show.ShowTime.Format("15:04")),
	}, nil
}

func (s *bookingService) GetUserBookings(userID int) ([]model.BookingWithDetails, error) {
	return s.seatStore.GetUserBookings(userID)
}

// bookMultipleSeats: Internal method for multi-seat booking
// Core DBMS concurrency control demonstration for multiple resources
func (s *bookingService) bookMultipleSeats(userID, showID int, seatNames []string) (*model.BookingResponse, error) {
	// STEP 1: Start PostgreSQL transaction - This is where ATOMICITY begins
	// All operations below will be atomic: either ALL succeed or ALL rollback
	tx, err := s.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}

	committed := false

	// CRITICAL: Always ensure transaction cleanup
	defer func() {
		if !committed {
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("Failed to rollback transaction: %v", rbErr)
			}
		}
	}()

	log.Printf("User %d attempting to book multiple seats: %v for show %d",
		userID, seatNames, showID)

	// STEP 2: CONCURRENCY CONTROL - Acquire row-level locks via FOR UPDATE
	// This is WHERE PostgreSQL ensures that concurrent transactions cannot interfere
	// Multiple users trying to book overlapping seats will be SERIALIZED here
	seats, err := s.seatStore.GetSeatsByNamesForUpdateInTx(tx, showID, seatNames)
	if err != nil {
		return nil, fmt.Errorf("failed to lock seats: %w", err)
	}

	// STEP 3: Validate that all requested seats exist
	if len(seats) != len(seatNames) {
		return nil, fmt.Errorf("some seats not found - requested: %d, found: %d",
			len(seatNames), len(seats))
	}

	// STEP 4: Check availability - ALL seats must be available
	// This demonstrates "ALL OR NOTHING" atomicity principle
	var unavailableSeats []string
	var seatIDs []int

	for _, seat := range seats {
		if seat.Status != model.SeatStatusAvailable {
			unavailableSeats = append(unavailableSeats, seat.SeatName)
		}
		seatIDs = append(seatIDs, seat.SeatID)
	}

	// If ANY seat is unavailable, ROLLBACK EVERYTHING
	// This is the "1 là tất cả, 2 là không có gì cả" principle
	if len(unavailableSeats) > 0 {
		log.Printf("Concurrency conflict detected: Seats %v already booked by other users",
			unavailableSeats)
		return nil, fmt.Errorf("seats no longer available: %v - already booked by other users",
			unavailableSeats)
	}

	// STEP 5: OPTIMISTIC CONCURRENCY - Bulk update seats to 'booked'
	// This UPDATE will only succeed if ALL seats are still 'available'
	// If another transaction changed ANY seat, rowsAffected < expected → CONFLICT!
	rowsUpdated, err := s.seatStore.UpdateMultipleSeatsInTx(
		tx,
		showID,
		seatNames,
		model.SeatStatusBooked,
		model.SeatStatusAvailable,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update seat statuses: %w", err)
	}

	// CRITICAL CONCURRENCY CHECK: Did we update all expected seats?
	// If rowsUpdated < len(seatNames), another transaction modified seats concurrently
	if rowsUpdated < len(seatNames) {
		log.Printf("Concurrency conflict: Expected to update %d seats, but only %d were updated",
			len(seatNames), rowsUpdated)
		return nil, fmt.Errorf("seats no longer available - concurrent booking detected")
	}

	// STEP 6: Create booking records for all seats
	// All bookings are created in the same transaction - maintaining consistency
	bookingIDs, err := s.seatStore.CreateMultipleBookingsInTx(tx, userID, seatIDs)
	if err != nil {
		return nil, fmt.Errorf("failed to create bookings: %w", err)
	}

	// STEP 7: COMMIT - Make all changes permanent atomically
	// Only if we reach here, all operations succeeded
	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	committed = true

	log.Printf("SUCCESS: User %d booked %d seats %v for show %d, booking IDs: %v",
		userID, len(seatNames), seatNames, showID, bookingIDs)

	// STEP 8: Get movie and show details for consistent user experience
	// This matches the response format of single-seat booking
	show, movie, err := s.getShowAndMovieDetails(showID)
	if err != nil {
		// Booking was successful, just return basic info
		log.Printf("Warning: Could not get movie details for response: %v", err)
		return &model.BookingResponse{
			BookingIDs: bookingIDs,
			SeatNames:  seatNames,
			Message:    fmt.Sprintf("Successfully booked %d seats", len(seatNames)),
		}, nil
	}
	// Return complete multi-seat booking response with movie info
	return &model.BookingResponse{
		BookingIDs: bookingIDs,
		SeatNames:  seatNames,
		MovieTitle: movie.Title,
		ShowTime:   show.ShowTime.Format("2006-01-02 15:04"),
		Message: fmt.Sprintf("Successfully booked %d seats for %s at %s",
			len(seatNames), movie.Title, show.ShowTime.Format("15:04")),
	}, nil
}

// Helper method to get comprehensive show and movie details
func (s *bookingService) getShowAndMovieDetails(showID int) (*model.Show, *model.Movie, error) {
	// First get show details
	show, err := s.showStore.GetByID(showID)
	if err != nil {
		return nil, nil, fmt.Errorf("show not found: %w", err)
	}

	// Then get movie details using the movie_id from show
	movie, err := s.movieStore.GetByID(show.MovieID)
	if err != nil {
		return nil, nil, fmt.Errorf("movie not found: %w", err)
	}

	return show, movie, nil
}

// CancelBooking: Cancel a booking and mark seat as available again
// Demonstrates transaction atomicity for cancellation operations
func (s *bookingService) CancelBooking(userID int, bookingID int) error {
	// Start transaction for atomic cancellation
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}

	committed := false

	defer func() {
		if !committed {
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("Failed to rollback transaction: %v", rbErr)
			}
		}
	}()

	log.Printf("User %d attempting to cancel booking %d", userID, bookingID)

	// Get booking details with user verification
	booking, err := s.seatStore.GetBookingByID(bookingID)
	if err != nil {
		return fmt.Errorf("booking not found: %w", err)
	}

	// Verify booking belongs to this user
	if booking.UserID != userID {
		return fmt.Errorf("unauthorized: booking does not belong to this user")
	}

	// Check if show time has passed - cannot cancel past shows
	if booking.ShowTime.Before(time.Now()) {
		return fmt.Errorf("cannot cancel booking: show time has already passed")
	}

	// Delete booking record
	err = s.seatStore.DeleteBookingInTx(tx, bookingID)
	if err != nil {
		return fmt.Errorf("failed to delete booking: %w", err)
	}

	// Mark seat as available again
	success, err := s.seatStore.UpdateSeatStatusInTx(
		tx,
		booking.SeatID,
		model.SeatStatusAvailable,
		model.SeatStatusBooked,
	)
	if err != nil {
		return fmt.Errorf("failed to update seat status: %w", err)
	}

	if !success {
		return fmt.Errorf("failed to free seat - seat may have been modified")
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	committed = true

	log.Printf("SUCCESS: User %d cancelled booking %d, seat %d is now available",
		userID, bookingID, booking.SeatID)

	return nil
}
