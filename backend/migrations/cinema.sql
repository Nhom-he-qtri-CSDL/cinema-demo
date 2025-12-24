--
-- PostgreSQL database dump
--

\restrict honSJWyDnnuEiZ27Z5PAxEqwPuuM8tBXYqa6jqUQOiGCKMdcNFaRMcbX4IKjpbj

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2025-12-24 16:29:33

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
    show_time timestamp with time zone NOT NULL
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

COPY public.bookings (booking_id, user_id, seat_id, bookat) FROM stdin;
\.


--
-- TOC entry 4935 (class 0 OID 16465)
-- Dependencies: 224
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movie_id, title, duration, description, url_image, rate, genre, release_date, director, cast_list) FROM stdin;
6	Phi Vụ Động Trời 2	145	Ethan Hunt và đội ngũ của anh tiếp tục cuộc chiến chống lại những kẻ thù nguy hiểm.	../../public/assets/images/film/zootopia.jpg	7.8	Hành động, Phiêu lưu	2024-11-20	Christopher McQuarrie	Tom Cruise, Miles Teller
7	Thế Hệ Kỳ Tích	138	Câu chuyện cảm động về một thế hệ trẻ và những giấc mơ của họ.	../../public/assets/images/film/the-he-ki-tich.jpg	8.2	Tâm lý, Chính kịch	2024-10-10	Various	Vietnamese Actors
8	Chân Trời Rực Rỡ	85	Một cuộc hành trình tài liệu khám phá những kỳ tích của thiên nhiên.	../../public/assets/images/film/ctrr.jpg	8.0	Tài liệu	2024-12-01	Documentary Team	Various
9	Anh Trai Tôi Là Khủng Long	120	Một bộ phim giả tưởng hài hước về anh trai là một chú khủng long.	../../public/assets/images/film/anh-trai-toi-la-khung-long.jpg	7.9	Giả tưởng, Hành động	2024-11-15	Vietnamese Director	Vietnamese Actors
10	Kumanthong Nhật Bản: Vong Nhi Cúp Bế	156	Một bộ phim kinh dị với những yếu tố tâm linh từ các nền văn hóa Á Đông.	../../public/assets/images/film/kumathong-japan.jpg	7.5	Kinh dị, Tâm linh	2024-12-05	Horror Master	Asian Actors
5	Avatar: Lửa Và Tro Tàn	197	Tiếp tục cuộc phiêu lưu trên hành tinh Pandora, Jake Sully và nhóm của anh ta phải đối mặt với những thách thức mới.	../../public/assets/images/film/avatar.jpg	8.5	Giả tưởng, Hành động	2024-12-15	James Cameron	Sam Worthington, Zoe Saldana
\.


--
-- TOC entry 4931 (class 0 OID 16429)
-- Dependencies: 220
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seats (seat_id, show_id, seat_name, status) FROM stdin;
6	7	A3	available
11	7	B5	available
13	7	B6	available
14	7	A7	available
15	7	B7	available
16	7	A8	available
17	7	B8	available
22	8	A1	available
23	8	B1	available
24	8	A2	available
25	8	B2	available
26	8	A3	available
27	8	B3	available
28	8	A4	available
30	8	A5	available
31	8	B5	available
32	8	A6	available
33	8	B6	available
34	8	A7	available
35	8	B7	available
36	8	A8	available
37	8	B8	available
43	9	B1	available
44	9	A2	available
45	9	B2	available
46	9	A3	available
47	9	B3	available
48	9	A4	available
49	9	B4	available
50	9	A5	available
51	9	B5	available
52	9	A6	available
53	9	B6	available
54	9	A7	available
55	9	B7	available
56	9	A8	available
57	9	B8	available
58	9	A9	available
59	9	B9	available
60	9	A10	available
61	9	B10	available
29	8	B4	available
4	7	A2	available
42	9	A1	available
2	7	A1	available
3	7	B1	available
8	7	A4	available
12	7	A6	available
10	7	A5	available
5	7	B2	available
7	7	B3	available
9	7	B4	available
62	10	A1	available
63	10	A2	available
64	10	A3	available
65	10	A4	available
66	10	A5	available
67	10	A6	available
68	10	A7	available
69	10	A8	available
70	10	B1	available
71	10	B2	available
72	10	B3	available
73	10	B4	available
74	10	B5	available
75	10	B6	available
76	10	B7	available
77	10	B8	available
78	10	C1	available
79	10	C2	available
80	10	C3	available
81	10	C4	available
82	10	C5	available
83	10	C6	available
84	10	C7	available
85	10	C8	available
86	10	D1	available
87	10	D2	available
88	10	D3	available
89	10	D4	available
90	10	D5	available
91	10	D6	available
92	10	D7	available
93	10	D8	available
94	10	E1	available
95	10	E2	available
96	10	E3	available
97	10	E4	available
98	10	E5	available
99	10	E6	available
100	10	E7	available
101	10	E8	available
102	11	A1	available
103	11	A2	available
104	11	A3	available
105	11	A4	available
106	11	A5	available
107	11	A6	available
108	11	A7	available
109	11	A8	available
110	11	B1	available
111	11	B2	available
112	11	B3	available
113	11	B4	available
114	11	B5	available
115	11	B6	available
116	11	B7	available
117	11	B8	available
118	11	C1	available
119	11	C2	available
120	11	C3	available
121	11	C4	available
122	11	C5	available
123	11	C6	available
124	11	C7	available
125	11	C8	available
126	11	D1	available
127	11	D2	available
128	11	D3	available
129	11	D4	available
130	11	D5	available
131	11	D6	available
132	11	D7	available
133	11	D8	available
134	11	E1	available
135	11	E2	available
136	11	E3	available
137	11	E4	available
138	11	E5	available
139	11	E6	available
140	11	E7	available
141	11	E8	available
142	12	A1	available
143	12	A2	available
144	12	A3	available
145	12	A4	available
146	12	A5	available
147	12	A6	available
148	12	A7	available
149	12	A8	available
150	12	B1	available
151	12	B2	available
152	12	B3	available
153	12	B4	available
154	12	B5	available
155	12	B6	available
156	12	B7	available
157	12	B8	available
158	12	C1	available
159	12	C2	available
160	12	C3	available
161	12	C4	available
162	12	C5	available
163	12	C6	available
164	12	C7	available
165	12	C8	available
166	12	D1	available
167	12	D2	available
168	12	D3	available
169	12	D4	available
170	12	D5	available
171	12	D6	available
172	12	D7	available
173	12	D8	available
174	12	E1	available
175	12	E2	available
176	12	E3	available
177	12	E4	available
178	12	E5	available
179	12	E6	available
180	12	E7	available
181	12	E8	available
182	13	A1	available
183	13	A2	available
184	13	A3	available
185	13	A4	available
186	13	A5	available
187	13	A6	available
188	13	A7	available
189	13	A8	available
190	13	B1	available
191	13	B2	available
192	13	B3	available
193	13	B4	available
194	13	B5	available
195	13	B6	available
196	13	B7	available
197	13	B8	available
198	13	C1	available
199	13	C2	available
200	13	C3	available
201	13	C4	available
202	13	C5	available
203	13	C6	available
204	13	C7	available
205	13	C8	available
206	13	D1	available
207	13	D2	available
208	13	D3	available
209	13	D4	available
210	13	D5	available
211	13	D6	available
212	13	D7	available
213	13	D8	available
214	13	E1	available
215	13	E2	available
216	13	E3	available
217	13	E4	available
218	13	E5	available
219	13	E6	available
220	13	E7	available
221	13	E8	available
222	14	A1	available
223	14	A2	available
224	14	A3	available
225	14	A4	available
226	14	A5	available
227	14	A6	available
228	14	A7	available
229	14	A8	available
230	14	B1	available
231	14	B2	available
232	14	B3	available
233	14	B4	available
234	14	B5	available
235	14	B6	available
236	14	B7	available
237	14	B8	available
238	14	C1	available
239	14	C2	available
240	14	C3	available
241	14	C4	available
242	14	C5	available
243	14	C6	available
244	14	C7	available
245	14	C8	available
246	14	D1	available
247	14	D2	available
248	14	D3	available
249	14	D4	available
250	14	D5	available
251	14	D6	available
252	14	D7	available
253	14	D8	available
254	14	E1	available
255	14	E2	available
256	14	E3	available
257	14	E4	available
258	14	E5	available
259	14	E6	available
260	14	E7	available
261	14	E8	available
262	15	A1	available
263	15	A2	available
264	15	A3	available
265	15	A4	available
266	15	A5	available
267	15	A6	available
268	15	A7	available
269	15	A8	available
270	15	B1	available
271	15	B2	available
272	15	B3	available
273	15	B4	available
274	15	B5	available
275	15	B6	available
276	15	B7	available
277	15	B8	available
278	15	C1	available
279	15	C2	available
280	15	C3	available
281	15	C4	available
282	15	C5	available
283	15	C6	available
284	15	C7	available
285	15	C8	available
286	15	D1	available
287	15	D2	available
288	15	D3	available
289	15	D4	available
290	15	D5	available
291	15	D6	available
292	15	D7	available
293	15	D8	available
294	15	E1	available
295	15	E2	available
296	15	E3	available
297	15	E4	available
298	15	E5	available
299	15	E6	available
300	15	E7	available
301	15	E8	available
302	16	A1	available
303	16	A2	available
304	16	A3	available
305	16	A4	available
306	16	A5	available
307	16	A6	available
308	16	A7	available
309	16	A8	available
310	16	B1	available
311	16	B2	available
312	16	B3	available
313	16	B4	available
314	16	B5	available
315	16	B6	available
316	16	B7	available
317	16	B8	available
318	16	C1	available
319	16	C2	available
320	16	C3	available
321	16	C4	available
322	16	C5	available
323	16	C6	available
324	16	C7	available
325	16	C8	available
326	16	D1	available
327	16	D2	available
328	16	D3	available
329	16	D4	available
330	16	D5	available
331	16	D6	available
332	16	D7	available
333	16	D8	available
334	16	E1	available
335	16	E2	available
336	16	E3	available
337	16	E4	available
338	16	E5	available
339	16	E6	available
340	16	E7	available
341	16	E8	available
342	17	A1	available
343	17	A2	available
344	17	A3	available
345	17	A4	available
346	17	A5	available
347	17	A6	available
348	17	A7	available
349	17	A8	available
350	17	B1	available
351	17	B2	available
352	17	B3	available
353	17	B4	available
354	17	B5	available
355	17	B6	available
356	17	B7	available
357	17	B8	available
358	17	C1	available
359	17	C2	available
360	17	C3	available
361	17	C4	available
362	17	C5	available
363	17	C6	available
364	17	C7	available
365	17	C8	available
366	17	D1	available
367	17	D2	available
368	17	D3	available
369	17	D4	available
370	17	D5	available
371	17	D6	available
372	17	D7	available
373	17	D8	available
374	17	E1	available
375	17	E2	available
376	17	E3	available
377	17	E4	available
378	17	E5	available
379	17	E6	available
380	17	E7	available
381	17	E8	available
382	18	A1	available
383	18	A2	available
384	18	A3	available
385	18	A4	available
386	18	A5	available
387	18	A6	available
388	18	A7	available
389	18	A8	available
390	18	B1	available
391	18	B2	available
392	18	B3	available
393	18	B4	available
394	18	B5	available
395	18	B6	available
396	18	B7	available
397	18	B8	available
398	18	C1	available
399	18	C2	available
400	18	C3	available
401	18	C4	available
402	18	C5	available
403	18	C6	available
404	18	C7	available
405	18	C8	available
406	18	D1	available
407	18	D2	available
408	18	D3	available
409	18	D4	available
410	18	D5	available
411	18	D6	available
412	18	D7	available
413	18	D8	available
414	18	E1	available
415	18	E2	available
416	18	E3	available
417	18	E4	available
418	18	E5	available
419	18	E6	available
420	18	E7	available
421	18	E8	available
422	19	A1	available
423	19	A2	available
424	19	A3	available
425	19	A4	available
426	19	A5	available
427	19	A6	available
428	19	A7	available
429	19	A8	available
430	19	B1	available
431	19	B2	available
432	19	B3	available
433	19	B4	available
434	19	B5	available
435	19	B6	available
436	19	B7	available
437	19	B8	available
438	19	C1	available
439	19	C2	available
440	19	C3	available
441	19	C4	available
442	19	C5	available
443	19	C6	available
444	19	C7	available
445	19	C8	available
446	19	D1	available
447	19	D2	available
448	19	D3	available
449	19	D4	available
450	19	D5	available
451	19	D6	available
452	19	D7	available
453	19	D8	available
454	19	E1	available
455	19	E2	available
456	19	E3	available
457	19	E4	available
458	19	E5	available
459	19	E6	available
460	19	E7	available
461	19	E8	available
462	20	A1	available
463	20	A2	available
464	20	A3	available
465	20	A4	available
466	20	A5	available
467	20	A6	available
468	20	A7	available
469	20	A8	available
470	20	B1	available
471	20	B2	available
472	20	B3	available
473	20	B4	available
474	20	B5	available
475	20	B6	available
476	20	B7	available
477	20	B8	available
478	20	C1	available
479	20	C2	available
480	20	C3	available
481	20	C4	available
482	20	C5	available
483	20	C6	available
484	20	C7	available
485	20	C8	available
486	20	D1	available
487	20	D2	available
488	20	D3	available
489	20	D4	available
490	20	D5	available
491	20	D6	available
492	20	D7	available
493	20	D8	available
494	20	E1	available
495	20	E2	available
496	20	E3	available
497	20	E4	available
498	20	E5	available
499	20	E6	available
500	20	E7	available
501	20	E8	available
504	21	A3	available
505	21	A4	available
506	21	A5	available
507	21	A6	available
509	21	A8	available
510	21	B1	available
511	21	B2	available
512	21	B3	available
513	21	B4	available
514	21	B5	available
515	21	B6	available
516	21	B7	available
517	21	B8	available
518	21	C1	available
519	21	C2	available
520	21	C3	available
521	21	C4	available
522	21	C5	available
523	21	C6	available
524	21	C7	available
525	21	C8	available
526	21	D1	available
527	21	D2	available
528	21	D3	available
529	21	D4	available
530	21	D5	available
531	21	D6	available
532	21	D7	available
533	21	D8	available
534	21	E1	available
535	21	E2	available
536	21	E3	available
537	21	E4	available
538	21	E5	available
539	21	E6	available
540	21	E7	available
541	21	E8	available
542	22	A1	available
543	22	A2	available
544	22	A3	available
545	22	A4	available
546	22	A5	available
547	22	A6	available
548	22	A7	available
549	22	A8	available
550	22	B1	available
551	22	B2	available
552	22	B3	available
553	22	B4	available
554	22	B5	available
555	22	B6	available
556	22	B7	available
557	22	B8	available
558	22	C1	available
559	22	C2	available
560	22	C3	available
561	22	C4	available
562	22	C5	available
563	22	C6	available
564	22	C7	available
565	22	C8	available
566	22	D1	available
567	22	D2	available
568	22	D3	available
569	22	D4	available
570	22	D5	available
571	22	D6	available
572	22	D7	available
573	22	D8	available
574	22	E1	available
575	22	E2	available
576	22	E3	available
577	22	E4	available
578	22	E5	available
579	22	E6	available
580	22	E7	available
581	22	E8	available
582	23	A1	available
583	23	A2	available
584	23	A3	available
585	23	A4	available
586	23	A5	available
587	23	A6	available
588	23	A7	available
589	23	A8	available
590	23	B1	available
591	23	B2	available
592	23	B3	available
593	23	B4	available
594	23	B5	available
595	23	B6	available
596	23	B7	available
597	23	B8	available
598	23	C1	available
599	23	C2	available
600	23	C3	available
601	23	C4	available
602	23	C5	available
603	23	C6	available
604	23	C7	available
605	23	C8	available
606	23	D1	available
607	23	D2	available
508	21	A7	available
608	23	D3	available
609	23	D4	available
610	23	D5	available
611	23	D6	available
612	23	D7	available
613	23	D8	available
614	23	E1	available
615	23	E2	available
616	23	E3	available
617	23	E4	available
618	23	E5	available
619	23	E6	available
620	23	E7	available
621	23	E8	available
622	24	A1	available
623	24	A2	available
624	24	A3	available
625	24	A4	available
626	24	A5	available
627	24	A6	available
628	24	A7	available
629	24	A8	available
630	24	B1	available
631	24	B2	available
632	24	B3	available
633	24	B4	available
634	24	B5	available
635	24	B6	available
636	24	B7	available
637	24	B8	available
638	24	C1	available
639	24	C2	available
640	24	C3	available
641	24	C4	available
642	24	C5	available
643	24	C6	available
644	24	C7	available
645	24	C8	available
646	24	D1	available
647	24	D2	available
648	24	D3	available
649	24	D4	available
650	24	D5	available
651	24	D6	available
652	24	D7	available
653	24	D8	available
654	24	E1	available
655	24	E2	available
656	24	E3	available
657	24	E4	available
658	24	E5	available
659	24	E6	available
660	24	E7	available
661	24	E8	available
662	25	A1	available
663	25	A2	available
664	25	A3	available
665	25	A4	available
666	25	A5	available
667	25	A6	available
668	25	A7	available
669	25	A8	available
670	25	B1	available
671	25	B2	available
672	25	B3	available
673	25	B4	available
674	25	B5	available
675	25	B6	available
676	25	B7	available
677	25	B8	available
678	25	C1	available
679	25	C2	available
680	25	C3	available
681	25	C4	available
682	25	C5	available
683	25	C6	available
684	25	C7	available
685	25	C8	available
686	25	D1	available
687	25	D2	available
688	25	D3	available
689	25	D4	available
690	25	D5	available
691	25	D6	available
692	25	D7	available
693	25	D8	available
694	25	E1	available
695	25	E2	available
696	25	E3	available
697	25	E4	available
698	25	E5	available
699	25	E6	available
700	25	E7	available
701	25	E8	available
702	26	A1	available
703	26	A2	available
704	26	A3	available
705	26	A4	available
706	26	A5	available
707	26	A6	available
708	26	A7	available
709	26	A8	available
710	26	B1	available
711	26	B2	available
712	26	B3	available
713	26	B4	available
714	26	B5	available
715	26	B6	available
716	26	B7	available
717	26	B8	available
718	26	C1	available
719	26	C2	available
720	26	C3	available
721	26	C4	available
722	26	C5	available
723	26	C6	available
724	26	C7	available
725	26	C8	available
726	26	D1	available
727	26	D2	available
728	26	D3	available
729	26	D4	available
730	26	D5	available
731	26	D6	available
732	26	D7	available
733	26	D8	available
734	26	E1	available
735	26	E2	available
736	26	E3	available
737	26	E4	available
738	26	E5	available
739	26	E6	available
740	26	E7	available
741	26	E8	available
502	21	A1	available
503	21	A2	available
\.


--
-- TOC entry 4929 (class 0 OID 16417)
-- Dependencies: 218
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shows (show_id, movie_id, show_time) FROM stdin;
9	5	2025-12-18 17:00:00+07
10	5	2025-12-18 20:00:00+07
11	6	2025-12-18 09:30:00+07
12	6	2025-12-18 12:45:00+07
13	6	2025-12-18 16:15:00+07
14	6	2025-12-18 19:45:00+07
15	6	2025-12-18 22:15:00+07
16	7	2025-12-18 11:00:00+07
17	7	2025-12-18 14:30:00+07
18	7	2025-12-18 18:00:00+07
19	8	2025-12-18 10:30:00+07
20	8	2025-12-18 15:00:00+07
21	9	2025-12-18 10:00:00+07
22	9	2025-12-18 13:00:00+07
23	9	2025-12-18 16:30:00+07
24	9	2025-12-18 19:30:00+07
25	10	2025-12-18 18:00:00+07
26	10	2025-12-18 21:00:00+07
7	5	2025-12-18 17:00:00+07
8	5	2026-02-01 13:30:00+07
\.


--
-- TOC entry 4927 (class 0 OID 16399)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password) FROM stdin;
1	user1@gmail.com	password123
2	user2@gmail.com	password123
3	user3@gmail.com	password123
\.


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 73, true);


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

SELECT pg_catalog.setval('public.seats_seat_id_seq', 741, true);


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 217
-- Name: shows_show_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shows_show_id_seq', 26, true);


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


-- Completed on 2025-12-24 16:29:33

--
-- PostgreSQL database dump complete
--

\unrestrict honSJWyDnnuEiZ27Z5PAxEqwPuuM8tBXYqa6jqUQOiGCKMdcNFaRMcbX4IKjpbj

