package store

import (
	"database/sql"
	"fmt"

	"cinema.com/demo/internal/model"
)

type SeatStore interface {
	GetByShowID(showID int) ([]model.Seat, error)
	GetByID(seatID int) (*model.Seat, error)
	// CRITICAL: These methods handle concurrency control via optimistic locking
	UpdateSeatStatusInTx(tx *sql.Tx, seatID int, newStatus string, expectedStatus string) (bool, error)
	CreateBookingInTx(tx *sql.Tx, userID, seatID int) (int, error)
	GetUserBookings(userID int) ([]model.BookingWithDetails, error)
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
			b.booking_id, b.user_id, b.seat_id, b.booked_at,
			s.seat_name, m.title, sh.show_time
		FROM bookings b
		JOIN seats s ON b.seat_id = s.seat_id
		JOIN shows sh ON s.show_id = sh.show_id
		JOIN movies m ON sh.movie_id = m.movie_id
		WHERE b.user_id = $1
		ORDER BY b.booked_at DESC`
	
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user bookings: %w", err)
	}
	defer rows.Close()
	
	var bookings []model.BookingWithDetails
	for rows.Next() {
		var booking model.BookingWithDetails
		err := rows.Scan(
			&booking.BookingID,
			&booking.UserID,
			&booking.SeatID,
			&booking.BookedAt,
			&booking.SeatName,
			&booking.MovieTitle,
			&booking.ShowTime,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan booking: %w", err)
		}
		bookings = append(bookings, booking)
	}
	
	return bookings, nil
}