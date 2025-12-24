package store

import (
	"database/sql"
	"fmt"
	"time"

	"cinema.com/demo/internal/model"
	"github.com/lib/pq"
)

type SeatStore interface {
	GetByShowID(showID int) ([]model.Seat, error)
	GetByID(seatID int) (*model.Seat, error)
	
	// Single seat booking (existing)
	UpdateSeatStatusInTx(tx *sql.Tx, seatID int, newStatus string, expectedStatus string) (bool, error)
	CreateBookingInTx(tx *sql.Tx, userID, seatID int) (int, error)
	
	// MULTI-SEAT BOOKING: PostgreSQL-level concurrency control
	// These methods implement database-level locking and bulk operations
	GetSeatsByNamesForUpdateInTx(tx *sql.Tx, showID int, seatNames []string) ([]model.Seat, error)
	UpdateMultipleSeatsInTx(tx *sql.Tx, showID int, seatNames []string, newStatus, expectedStatus string) (int, error)
	CreateMultipleBookingsInTx(tx *sql.Tx, userID int, seatIDs []int) ([]int, error)
	
	GetUserBookings(userID int) ([]model.BookingWithDetails, error)
	
	// Booking cancellation
	GetBookingByID(bookingID int) (*model.Booking, error)
	DeleteBookingInTx(tx *sql.Tx, bookingID int) error
}

type seatStore struct {
	db *sql.DB
}

func NewSeatStore(db *sql.DB) SeatStore {
	return &seatStore{db: db}
}

func (s *seatStore) GetByShowID(showID int) ([]model.Seat, error) {
	query := `
		SELECT seat_id, show_id, seat_name, status 
		FROM seats 
		WHERE show_id = $1 
		ORDER BY seat_name`
	
	rows, err := s.db.Query(query, showID)
	if err != nil {
		return nil, fmt.Errorf("failed to query seats: %w", err)
	}
	defer rows.Close()
	
	var seats []model.Seat
	for rows.Next() {
		var seat model.Seat
		err := rows.Scan(
			&seat.SeatID,
			&seat.ShowID,
			&seat.SeatName,
			&seat.Status,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan seat: %w", err)
		}
		seats = append(seats, seat)
	}
	
	return seats, nil
}

func (s *seatStore) GetByID(seatID int) (*model.Seat, error) {
	query := `SELECT seat_id, show_id, seat_name, status FROM seats WHERE seat_id = $1`
	
	var seat model.Seat
	err := s.db.QueryRow(query, seatID).Scan(
		&seat.SeatID,
		&seat.ShowID,
		&seat.SeatName,
		&seat.Status,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("seat not found")
		}
		return nil, fmt.Errorf("failed to get seat: %w", err)
	}
	
	return &seat, nil
}

// CONCURRENCY CONTROL: This is where the magic happens!
// We use optimistic concurrency control - only update if the seat is still in expected status
func (s *seatStore) UpdateSeatStatusInTx(tx *sql.Tx, seatID int, newStatus string, expectedStatus string) (bool, error) {
	query := `
		UPDATE seats 
		SET status = $1 
		WHERE seat_id = $2 AND status = $3`
	
	result, err := tx.Exec(query, newStatus, seatID, expectedStatus)
	if err != nil {
		return false, fmt.Errorf("failed to update seat status: %w", err)
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	// If no rows were affected, it means the seat was already booked by someone else
	// This is how we detect concurrency conflicts!
	return rowsAffected > 0, nil
}

func (s *seatStore) CreateBookingInTx(tx *sql.Tx, userID, seatID int) (int, error) {
	query := `
		INSERT INTO bookings (user_id, seat_id) 
		VALUES ($1, $2) 
		RETURNING booking_id`
	
	var bookingID int
	err := tx.QueryRow(query, userID, seatID).Scan(&bookingID)
	if err != nil {
		return 0, fmt.Errorf("failed to create booking: %w", err)
	}
	
	return bookingID, nil
}

func (s *seatStore) GetUserBookings(userID int) ([]model.BookingWithDetails, error) {
	query := `
		SELECT 
			b.booking_id, b.user_id, b.seat_id, b.bookat,
			s.seat_name, m.title, sh.show_time
		FROM bookings b
		JOIN seats s ON b.seat_id = s.seat_id
		JOIN shows sh ON s.show_id = sh.show_id
		JOIN movies m ON sh.movie_id = m.movie_id
		WHERE b.user_id = $1
		ORDER BY b.bookat DESC`
	
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user bookings: %w", err)
	}
	defer rows.Close()
	
	var bookings []model.BookingWithDetails
	for rows.Next() {
		var booking model.BookingWithDetails
		var showTime time.Time
		err := rows.Scan(
			&booking.BookingID,
			&booking.UserID,
			&booking.SeatID,
			&booking.BookedAt,
			&booking.SeatName,
			&booking.MovieTitle,
			&showTime,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan booking: %w", err)
		}

		booking.ShowTime = showTime.Format("2006-01-02 15:04")
		
		bookings = append(bookings, booking)
	}
	
	return bookings, nil
}

// ==================== MULTI-SEAT BOOKING METHODS ====================
// These methods implement PostgreSQL-level concurrency control for booking multiple seats

// GetSeatsByNamesForUpdateInTx: SELECT ... FOR UPDATE
// CRITICAL CONCURRENCY CONTROL: This acquires row-level locks in PostgreSQL
// Multiple transactions trying to book the same seats will be serialized here
func (s *seatStore) GetSeatsByNamesForUpdateInTx(tx *sql.Tx, showID int, seatNames []string) ([]model.Seat, error) {
	// EDUCATIONAL NOTE: FOR UPDATE clause makes PostgreSQL acquire exclusive row locks
	// This ensures that concurrent transactions cannot modify these rows until commit/rollback
	// This is WHERE PostgreSQL handles concurrency - NOT in Go application code!
	
	query := `
		SELECT seat_id, show_id, seat_name, status 
		FROM seats 
		WHERE show_id = $1 AND seat_name = ANY($2)
		FOR UPDATE`
	
	rows, err := tx.Query(query, showID, pq.Array(seatNames))
	if err != nil {
		return nil, fmt.Errorf("failed to query seats with lock: %w", err)
	}
	defer rows.Close()
	
	var seats []model.Seat
	for rows.Next() {
		var seat model.Seat
		err := rows.Scan(
			&seat.SeatID,
			&seat.ShowID,
			&seat.SeatName,
			&seat.Status,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan seat: %w", err)
		}
		seats = append(seats, seat)
	}
	
	return seats, nil
}

// UpdateMultipleSeatsInTx: Bulk update with optimistic concurrency control
// CRITICAL: Updates only seats that are currently in expectedStatus
// Returns number of rows actually updated - this is how we detect conflicts!
func (s *seatStore) UpdateMultipleSeatsInTx(tx *sql.Tx, showID int, seatNames []string, newStatus, expectedStatus string) (int, error) {
	// EDUCATIONAL NOTE: This UPDATE will only affect rows where status = expectedStatus
	// If another transaction already changed the status, rowsAffected will be less than expected
	// This is PostgreSQL's optimistic concurrency control in action!
	
	query := `
		UPDATE seats 
		SET status = $1 
		WHERE show_id = $2 
		  AND seat_name = ANY($3) 
		  AND status = $4`
	
	result, err := tx.Exec(query, newStatus, showID, pq.Array(seatNames), expectedStatus)
	if err != nil {
		return 0, fmt.Errorf("failed to update multiple seats: %w", err)
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	return int(rowsAffected), nil
}

// CreateMultipleBookingsInTx: Insert multiple booking records in one transaction
// All bookings share the same transaction - ensuring atomicity
func (s *seatStore) CreateMultipleBookingsInTx(tx *sql.Tx, userID int, seatIDs []int) ([]int, error) {
	var bookingIDs []int
	
	// Insert each booking and collect the generated IDs
	for _, seatID := range seatIDs {
		query := `
			INSERT INTO bookings (user_id, seat_id) 
			VALUES ($1, $2) 
			RETURNING booking_id`
		
		var bookingID int
		err := tx.QueryRow(query, userID, seatID).Scan(&bookingID)
		if err != nil {
			return nil, fmt.Errorf("failed to create booking for seat %d: %w", seatID, err)
		}
		bookingIDs = append(bookingIDs, bookingID)
	}
	
	return bookingIDs, nil
}

// GetBookingByID: Get booking details by ID with show_time for validation
func (s *seatStore) GetBookingByID(bookingID int) (*model.Booking, error) {
	query := `
		SELECT b.booking_id, b.user_id, b.seat_id, b.bookat, sh.show_time
		FROM bookings b
		JOIN seats s ON b.seat_id = s.seat_id
		JOIN shows sh ON s.show_id = sh.show_id
		WHERE b.booking_id = $1`
	
	var booking model.Booking
	err := s.db.QueryRow(query, bookingID).Scan(
		&booking.BookingID,
		&booking.UserID,
		&booking.SeatID,
		&booking.BookedAt,
		&booking.ShowTime,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("booking not found")
		}
		return nil, fmt.Errorf("failed to get booking: %w", err)
	}
	
	return &booking, nil
}

// DeleteBookingInTx: Delete a booking record within a transaction
func (s *seatStore) DeleteBookingInTx(tx *sql.Tx, bookingID int) error {
	query := `DELETE FROM bookings WHERE booking_id = $1`
	
	result, err := tx.Exec(query, bookingID)
	if err != nil {
		return fmt.Errorf("failed to delete booking: %w", err)
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	if rowsAffected == 0 {
		return fmt.Errorf("booking not found or already deleted")
	}
	
	return nil
}