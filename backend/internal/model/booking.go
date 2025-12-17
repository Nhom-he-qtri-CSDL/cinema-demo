package model

import "time"

type Booking struct {
	BookingID int       `json:"booking_id" db:"booking_id"`
	UserID    int       `json:"user_id" db:"user_id"`
	SeatID    int       `json:"seat_id" db:"seat_id"`
	BookedAt  time.Time `json:"booked_at" db:"booked_at"`
}

type BookingRequest struct {
	SeatID int `json:"seat_id" binding:"required"`
}

type BookingResponse struct {
	BookingID int    `json:"booking_id"`
	SeatName  string `json:"seat_name"`
	MovieTitle string `json:"movie_title"`
	ShowTime  time.Time `json:"show_time"`
	Message   string `json:"message"`
}

// BookingWithDetails contains booking information with related data
type BookingWithDetails struct {
	Booking
	SeatName   string    `json:"seat_name" db:"seat_name"`
	MovieTitle string    `json:"movie_title" db:"title"`
	ShowTime   time.Time `json:"show_time" db:"show_time"`
}