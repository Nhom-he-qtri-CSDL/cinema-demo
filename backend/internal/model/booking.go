package model

import "time"

type Booking struct {
	BookingID int       `json:"booking_id" db:"booking_id"`
	UserID    int       `json:"user_id" db:"user_id"`
	SeatID    int       `json:"seat_id" db:"seat_id"`
	BookedAt  time.Time `json:"booked_at" db:"booked_at"`
}

// Unified booking request - supports both single and multi-seat booking
type BookingRequest struct {
	// For single seat booking (legacy support)
	SeatID *int `json:"seat_id,omitempty"`
	
	// For multi-seat booking (new unified approach)
	ShowID    int      `json:"show_id,omitempty"`
	SeatNames []string `json:"seats,omitempty"`
}

// Unified booking response - handles both single and multi-seat results
type BookingResponse struct {
	// Single booking fields
	BookingID  *int   `json:"booking_id,omitempty"`
	SeatName   string `json:"seat_name,omitempty"`
	
	// Multi booking fields  
	BookingIDs []int    `json:"booking_ids,omitempty"`
	SeatNames  []string `json:"seat_names,omitempty"`
	
	// Common fields
	MovieTitle string    `json:"movie_title,omitempty"`
	ShowTime   string `json:"show_time,omitempty"`
	Message    string    `json:"message"`
}

// BookingWithDetails contains booking information with related data
type BookingWithDetails struct {
	Booking
	SeatName   string    `json:"seat_name" db:"seat_name"`
	MovieTitle string    `json:"movie_title" db:"title"`
	ShowTime   string `json:"show_time" db:"show_time"`
}