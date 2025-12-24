package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

// NewConnection creates a new PostgreSQL database connection
func NewConnection(config Config) (*sql.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Host, config.Port, config.User, config.Password, config.DBName)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	_, err = db.Exec("SET timezone = 'Asia/Ho_Chi_Minh'")
	if err != nil {
		log.Printf("Warning: Could not set timezone: %v", err)
	} else {
		log.Println("Database timezone set to Asia/Ho_Chi_Minh")
	}

	log.Println("Successfully connected to PostgreSQL database")
	return db, nil
}

// DefaultConfig returns a default database configuration for local development
func DefaultConfig() Config {
	return Config{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "1",
		DBName:   "cinema",
	}
}
