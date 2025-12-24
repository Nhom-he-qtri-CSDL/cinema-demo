--
-- PostgreSQL database dump
--

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2025-12-23 23:37:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Drop existing tables if they exist (in correct order due to foreign keys)
--

DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.seats CASCADE;
DROP TABLE IF EXISTS public.shows CASCADE;
DROP TABLE IF EXISTS public.movies CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

--
-- TOC entry 222 (class 1259 OID 16445)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    user_id integer NOT NULL,
    seat_id integer NOT NULL,
    bookat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16444)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 224 (class 1259 OID 16465)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    title character varying(100) NOT NULL,
    duration integer,
    description text,
    url_image character varying(255) DEFAULT 'ok.png'::character varying NOT NULL,
    rate numeric(3,1),
    genre character varying(200),
    release_date date,
    director character varying(50),
    cast_list character varying(100),
    CONSTRAINT movies_rate_check CHECK (((rate >= (0)::numeric) AND (rate <= (10)::numeric)))
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16464)
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_movie_id_seq OWNER TO postgres;

--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 223
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- TOC entry 220 (class 1259 OID 16429)
-- Name: seats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seats (
    seat_id integer NOT NULL,
    show_id integer NOT NULL,
    seat_name character varying(10) NOT NULL,
    status character varying(10) NOT NULL,
    CONSTRAINT seats_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'booked'::character varying])::text[])))
);


ALTER TABLE public.seats OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16428)
-- Name: seats_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seats_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seats_seat_id_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 219
-- Name: seats_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seats_seat_id_seq OWNED BY public.seats.seat_id;


--
-- TOC entry 218 (class 1259 OID 16417)
-- Name: shows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shows (
    show_id integer NOT NULL,
    movie_id integer NOT NULL,
    show_time timestamp without time zone NOT NULL
);


ALTER TABLE public.shows OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16416)
-- Name: shows_show_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shows_show_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shows_show_id_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 217
-- Name: shows_show_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shows_show_id_seq OWNED BY public.shows.show_id;


--
-- TOC entry 216 (class 1259 OID 16399)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4758 (class 2604 OID 16448)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 16468)
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 16432)
-- Name: seats seat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats ALTER COLUMN seat_id SET DEFAULT nextval('public.seats_seat_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16420)
-- Name: shows show_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows ALTER COLUMN show_id SET DEFAULT nextval('public.shows_show_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16402)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4933 (class 0 OID 16445)
-- Dependencies: 222
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bookings (booking_id, user_id, seat_id, bookat) VALUES
(1, 1, 2, '2025-12-20 09:35:27.257316'),
(2, 2, 6, '2025-12-20 09:35:27.340017'),
(3, 1, 10, '2025-12-20 09:35:29.698726');


--
-- TOC entry 4935 (class 0 OID 16465)
-- Dependencies: 224
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.movies (movie_id, title, duration, description, url_image, rate, genre, release_date, director, cast_list) VALUES
(6, 'Phi Vụ Động Trời 2', 145, 'Ethan Hunt và đội ngũ của anh tiếp tục cuộc chiến chống lại những kẻ thù nguy hiểm.', '/assets/images/film/zootopia.jpg', 7.8, 'Hành động, Phiêu lưu', '2024-11-20', 'Christopher McQuarrie', 'Tom Cruise, Miles Teller'),
(5, 'Avatar: Lửa Và Tro Tàn', 197, 'Tiếp tục cuộc phiêu lưu trên hành tinh Pandora, Jake Sully và nhóm của anh ta phải đối mặt với những thách thức mới.', '/assets/images/film/avatar.jpg', 8.5, 'Giả tưởng, Hành động', '2024-12-15', 'James Cameron', 'Sam Worthington, Zoe Saldana'),
(7, 'Thế Hệ Kỳ Tích', 138, 'Câu chuyện cảm động về một thế hệ trẻ và những giấc mơ của họ.', '/assets/images/film/the-he-ki-tich.jpg', 8.2, 'Tâm lý, Chính kịch', '2024-10-10', 'Various', 'Vietnamese Actors'),
(8, 'Chân Trời Rực Rỡ', 85, 'Một cuộc hành trình tài liệu khám phá những kỳ tích của thiên nhiên.', '/assets/images/film/ctrr.jpg', 8.0, 'Tài liệu', '2024-12-01', 'Documentary Team', 'Various'),
(9, 'Anh Trai Tôi Là Khủng Long', 120, 'Một bộ phim giả tưởng hài hước về anh trai là một chú khủng long.', '/assets/images/film/anh-trai-toi-la-khung-long.jpg', 7.9, 'Giả tưởng, Hành động', '2024-11-15', 'Vietnamese Director', 'Vietnamese Actors'),
(10, 'Kumanthong Nhật Bản: Vong Nhi Cúp Bế', 156, 'Một bộ phim kinh dị với những yếu tố tâm linh từ các nền văn hóa Á Đông.', '/assets/images/film/kumathong-japan.jpg', 7.5, 'Kinh dị, Tâm linh', '2024-12-05', 'Horror Master', 'Asian Actors');


--
-- TOC entry 4931 (class 0 OID 16429)
-- Dependencies: 220
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: postgres
--

-- Ghế cho Show 7 (Avatar - 10:00) - 12 ghế
INSERT INTO public.seats (seat_id, show_id, seat_name, status) VALUES
(1, 7, 'A1', 'available'),
(2, 7, 'A2', 'available'),
(3, 7, 'A3', 'available'),
(4, 7, 'A4', 'available'),
(5, 7, 'B1', 'available'),
(6, 7, 'B2', 'available'),
(7, 7, 'B3', 'available'),
(8, 7, 'B4', 'available'),
(9, 7, 'C1', 'available'),
(10, 7, 'C2', 'available'),
(11, 7, 'C3', 'available'),
(12, 7, 'C4', 'available'),

-- Ghế cho Show 8 (Avatar - 13:30) - 12 ghế
(13, 8, 'A1', 'available'),
(14, 8, 'A2', 'available'),
(15, 8, 'A3', 'available'),
(16, 8, 'A4', 'available'),
(17, 8, 'B1', 'available'),
(18, 8, 'B2', 'available'),
(19, 8, 'B3', 'available'),
(20, 8, 'B4', 'available'),
(21, 8, 'C1', 'available'),
(22, 8, 'C2', 'available'),
(23, 8, 'C3', 'available'),
(24, 8, 'C4', 'available'),

-- Ghế cho Show 9 (Avatar - 17:00) - 12 ghế
(25, 9, 'A1', 'available'),
(26, 9, 'A2', 'available'),
(27, 9, 'A3', 'available'),
(28, 9, 'A4', 'available'),
(29, 9, 'B1', 'available'),
(30, 9, 'B2', 'available'),
(31, 9, 'B3', 'available'),
(32, 9, 'B4', 'available'),
(33, 9, 'C1', 'available'),
(34, 9, 'C2', 'available'),
(35, 9, 'C3', 'available'),
(36, 9, 'C4', 'available');


--
-- TOC entry 4929 (class 0 OID 16417)
-- Dependencies: 218
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shows (show_id, movie_id, show_time) VALUES
(7, 5, '2025-12-18 10:00:00'),
(8, 5, '2025-12-18 13:30:00'),
(9, 5, '2025-12-18 17:00:00');


--
-- TOC entry 4927 (class 0 OID 16399)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (user_id, email, password) VALUES
(1, 'user1@gmail.com', 'password123'),
(2, 'user2@gmail.com', 'password123'),
(3, 'user3@gmail.com', 'password123');


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 3, true);


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 223
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 10, true);


--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 219
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 36, true);


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 217
-- Name: shows_show_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shows_show_id_seq', 9, true);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 4775 (class 2606 OID 16451)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4779 (class 2606 OID 16472)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 4771 (class 2606 OID 16435)
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (seat_id);


--
-- TOC entry 4769 (class 2606 OID 16422)
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (show_id);


--
-- TOC entry 4777 (class 2606 OID 16453)
-- Name: bookings unique_seat_booking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT unique_seat_booking UNIQUE (seat_id);


--
-- TOC entry 4773 (class 2606 OID 16437)
-- Name: seats unique_seat_per_show; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT unique_seat_per_show UNIQUE (show_id, seat_name);


--
-- TOC entry 4765 (class 2606 OID 16406)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4767 (class 2606 OID 16404)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4781 (class 2606 OID 16459)
-- Name: bookings fk_booking_seat; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_seat FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id);


--
-- TOC entry 4782 (class 2606 OID 16454)
-- Name: bookings fk_booking_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4780 (class 2606 OID 16438)
-- Name: seats fk_seat_show; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT fk_seat_show FOREIGN KEY (show_id) REFERENCES public.shows(show_id);


-- Completed on 2025-12-23 23:37:24

--
-- PostgreSQL database dump complete
--


