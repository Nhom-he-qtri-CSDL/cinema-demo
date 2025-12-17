package model

type Movie struct {
	MovieID     int    `json:"movie_id" db:"movie_id"`
	Title       string `json:"title" db:"title"`
	Duration    int    `json:"duration" db:"duration"`
	Description string `json:"description" db:"description"`
}