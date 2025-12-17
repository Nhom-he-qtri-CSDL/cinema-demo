create table users (
	user_id		serial primary key,
	email		varchar(50) unique not null,
	password	varchar(50) not null
);

create table movies (
	movie_id	serial primary key,
	title		varchar(100) not null,
	duration	int,
	description	text
);

create table shows (
	show_id		serial primary key,
	movie_id	int not null,
	show_time	timestamp not null,

	constraint fk_show_movie foreign key (movie_id) references movies(movie_id)
);

create table seats (
	seat_id		serial primary key,
	show_id		int not null,
	seat_name	varchar(10) not null,
	status		varchar(10) not null check (status in ('available','booked')),

	constraint fk_seat_show foreign key (show_id) references shows(show_id),

	constraint unique_seat_per_show unique (show_id, seat_name)
);

create table bookings (
	booking_id		serial primary key,
	user_id		int not null,
	seat_id		int not null,
	bookat 		timestamp default current_timestamp,

	constraint fk_booking_user foreign key (user_id) references users(user_id),
	constraint fk_booking_seat foreign key (seat_id) references seats(seat_id),

	constraint unique_seat_booking unique (seat_id)
);

INSERT INTO users (email, password) VALUES 
('user1@gmail.com', 'password123'),
('user2@gmail.com', 'password123'),
('user3@gmail.com', 'password123');

INSERT INTO movies (title, duration, description) VALUES 
('Avatar: The Way of Water', 192, 'Epic science fiction film'),
('Top Gun: Maverick', 130, 'Action drama film');

INSERT INTO shows (movie_id, show_time) VALUES 
(1, '2025-12-18 19:00:00'),
(1, '2025-12-18 22:00:00'),
(2, '2025-12-18 20:00:00');

INSERT INTO seats (show_id, seat_name, status)
SELECT s.show_id, 
       row_letter || seat_number,
       'available'
FROM shows s
CROSS JOIN (SELECT 'A' AS row_letter UNION SELECT 'B') rows
CROSS JOIN generate_series(1, 10) AS gs(seat_number);


