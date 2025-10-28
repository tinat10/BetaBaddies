--
-- PostgreSQL database dump
--

\restrict 8cefIDIueZbJCGs5T4fbr5dVkBaP2yCn4QkYQnRPgtlH2Wczna8vnATrfNB994p

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-27 20:56:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 228 (class 1255 OID 16404)
-- Name: addupdatetime(); Type: FUNCTION; Schema: public; Owner: superUser
--

CREATE FUNCTION public.addupdatetime() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$;


ALTER FUNCTION public.addupdatetime() OWNER TO "superUser";

--
-- TOC entry 227 (class 1255 OID 16402)
-- Name: lower_email(); Type: FUNCTION; Schema: public; Owner: superUser
--

CREATE FUNCTION public.lower_email() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
NEW.email = LOWER(NEW.email);
RETURN NEW;
END;
$$;


ALTER FUNCTION public.lower_email() OWNER TO "superUser";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16525)
-- Name: certifications; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.certifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    never_expires boolean NOT NULL,
    name character varying(255) NOT NULL,
    org_name character varying(255) NOT NULL,
    date_earned date NOT NULL,
    expiration_date date
);


ALTER TABLE public.certifications OWNER TO "superUser";

--
-- TOC entry 224 (class 1259 OID 16508)
-- Name: educations; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.educations (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    school character varying(255) NOT NULL,
    degree_type character varying(20) NOT NULL,
    field character varying(255),
    honors character varying(1000),
    gpa numeric(4,3),
    is_enrolled boolean NOT NULL,
    graddate date NOT NULL,
    startdate date
);


ALTER TABLE public.educations OWNER TO "superUser";

--
-- TOC entry 221 (class 1259 OID 16449)
-- Name: files; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.files (
    file_id uuid NOT NULL,
    file_data character varying(255),
    file_path character varying(255)
);


ALTER TABLE public.files OWNER TO "superUser";

--
-- TOC entry 222 (class 1259 OID 16471)
-- Name: jobs; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.jobs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    location character varying(255),
    end_date date,
    is_current boolean DEFAULT false NOT NULL,
    description character varying(1000),
    salary numeric,
    start_date date NOT NULL
);


ALTER TABLE public.jobs OWNER TO "superUser";

--
-- TOC entry 220 (class 1259 OID 16407)
-- Name: profiles; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.profiles (
    first_name character varying(255) NOT NULL,
    middle_name character varying(255),
    last_name character varying(255) NOT NULL,
    phone character varying(15),
    city character varying(255),
    state character(2) NOT NULL,
    job_title character varying(255),
    bio character varying(500),
    industry character varying(255),
    exp_level character varying(10),
    user_id uuid NOT NULL,
    pfp_link character varying(1000) DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'::character varying NOT NULL
);
ALTER TABLE ONLY public.profiles ALTER COLUMN pfp_link SET STORAGE PLAIN;


ALTER TABLE public.profiles OWNER TO "superUser";

--
-- TOC entry 226 (class 1259 OID 16543)
-- Name: projects; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.projects (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    link character varying(500),
    description character varying(500),
    start_date date NOT NULL,
    end_date date,
    technologies character varying(500),
    collaborators character varying(255),
    status character varying(10) NOT NULL,
    industry character varying(255)
);


ALTER TABLE public.projects OWNER TO "superUser";

--
-- TOC entry 223 (class 1259 OID 16490)
-- Name: skills; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.skills (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    skill_name character varying(100) NOT NULL,
    proficiency character varying(15) NOT NULL,
    category character varying(20),
    skill_badge character varying(500)
);


ALTER TABLE public.skills OWNER TO "superUser";

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.users (
    u_id uuid NOT NULL,
    password character varying(64),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reset_token character varying(255),
    reset_token_expires timestamp without time zone
);


ALTER TABLE public.users OWNER TO "superUser";

--
-- TOC entry 5070 (class 0 OID 16525)
-- Dependencies: 225
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.certifications (id, user_id, never_expires, name, org_name, date_earned, expiration_date) FROM stdin;
\.


--
-- TOC entry 5069 (class 0 OID 16508)
-- Dependencies: 224
-- Data for Name: educations; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.educations (id, user_id, school, degree_type, field, honors, gpa, is_enrolled, graddate, startdate) FROM stdin;
\.


--
-- TOC entry 5066 (class 0 OID 16449)
-- Dependencies: 221
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.files (file_id, file_data, file_path) FROM stdin;
\.


--
-- TOC entry 5067 (class 0 OID 16471)
-- Dependencies: 222
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.jobs (id, user_id, title, company, location, end_date, is_current, description, salary, start_date) FROM stdin;
\.


--
-- TOC entry 5065 (class 0 OID 16407)
-- Dependencies: 220
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.profiles (first_name, middle_name, last_name, phone, city, state, job_title, bio, industry, exp_level, user_id, pfp_link) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 16543)
-- Dependencies: 226
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.projects (id, user_id, name, link, description, start_date, end_date, technologies, collaborators, status, industry) FROM stdin;
\.


--
-- TOC entry 5068 (class 0 OID 16490)
-- Dependencies: 223
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.skills (id, user_id, skill_name, proficiency, category, skill_badge) FROM stdin;
\.


--
-- TOC entry 5064 (class 0 OID 16390)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.users (u_id, password, created_at, email, updated_at, reset_token, reset_token_expires) FROM stdin;
cdfdbfa7-f129-46d0-b508-03165a18e200	$2b$12$8EcsAASTRbqRIj53vUe6cuF2YbJ4RGn2Lo/8Ag9OuV2X5KCud4FgO	2025-10-23 23:28:19.113589-04	test2-1761276498416@example.com	2025-10-23 23:28:19.113589-04	\N	\N
bd11bd06-d36d-434b-ba5f-a1c53c21bb07	$2b$12$tp3rYlt9fAd3jpz.xzCAIud22PwQTHDwVkzHTPQAttXaOyHoFE1pe	2025-10-23 23:28:20.543557-04	newuser-1761276500242@example.com	2025-10-23 23:28:20.543557-04	\N	\N
c438b2a9-da50-4045-a904-4e35272c387f	$2b$12$oGiqwxoWQmTvS7O7StMrZuZnH/k1/7bJx5T2mJ1QzfpdEFpIXZ3nq	2025-10-23 23:28:21.185243-04	authtest-1761276500909@example.com	2025-10-23 23:28:21.185243-04	\N	\N
5a78afab-f1ef-43b1-b1ed-14bb9c4cecbc	$2b$12$uWPSqO8jejvrH97eo9NCNe5D.fRXvIcSimRvMYn7U.WdJMSCoyhh6	2025-10-24 16:16:16.191174-04	authtest-1761336975908@example.com	2025-10-24 16:16:16.191174-04	\N	\N
420d82b9-cd4c-441c-8f30-12c1951f8e72	$2b$10$uOxmUB8fJe9MvxqPYFTVIOYieDRfaV2Whk2o1TzTC5bT5OpeoSTIa	2025-10-24 16:17:00.172772-04	test1-1761337019661@example.com	2025-10-24 16:17:03.767562-04	expired-token	2025-10-24 15:17:03.764
f4eb8f3b-1eac-4ba3-8442-9465cffd034e	$2b$10$wzvzlQBiBU0dWNkWj8FIS.GvJwnRSPkANIAdjLpFsZN3Hxk6dsyTG	2025-10-23 23:28:18.819799-04	test1-1761276498415@example.com	2025-10-23 23:28:21.482621-04	expired-token	2025-10-23 22:28:21.481
94b5170d-cdf9-4944-881a-f1233b800cf6	$2b$12$.jURMbxvFsSnm8nXIf9S7O3ynt6GC5rxdU/ub2aWYM6YhHB55MdAS	2025-10-23 23:29:57.456548-04	test2-1761276596558@example.com	2025-10-23 23:29:57.456548-04	\N	\N
0413aea7-e221-4124-aaf4-52a9f6a58b3f	$2b$12$4vFGOeUJYJ/lxxFBZMcKyuSyswyt7OXZbMoe1pAoGMP5NhPa1Co.m	2025-10-23 23:29:59.14423-04	newuser-1761276598865@example.com	2025-10-23 23:29:59.14423-04	\N	\N
7fe28da3-22c7-43f8-8083-5f70776f3570	$2b$12$bW8aEsvAIPlvWcBrFodnZ.NHwEoCJeAM7Z9K4dgG0NnGcKW7/3kTC	2025-10-23 23:29:59.717641-04	authtest-1761276599433@example.com	2025-10-23 23:29:59.717641-04	\N	\N
214ae2dd-4ac2-4ea8-95ef-245c1a7ca106	$2b$10$.c3mxwZWQ5IwwoCEhVosZef6R..lbDQazvYkunO06KvptxvTLCgrW	2025-10-24 16:16:13.441069-04	test1-1761336972855@example.com	2025-10-24 16:16:17.084745-04	expired-token	2025-10-24 15:16:17.083
2773560a-4789-4345-8e70-0bd7354ba0b8	$2b$10$hKz5UxW7WABcfXvp4KUhne7f5ISwyYZGZ81v8XVA5fnTQYR1KhCW.	2025-10-23 23:29:57.059094-04	test1-1761276596558@example.com	2025-10-23 23:30:00.151953-04	expired-token	2025-10-23 22:30:00.149
24c379c4-ac98-4d16-9e10-200228bdfc86	$2b$12$CWmZlsj80FyoDxv8ngGzyuo7DO3ILHvP0o2yeeKjoqukq2sVovxK6	2025-10-23 23:31:28.06718-04	test2-1761276687139@example.com	2025-10-23 23:31:28.06718-04	\N	\N
469b1f91-8b61-4f3e-af83-4036304a0cb9	$2b$12$GomFFDWW11dRxedWc/7dpO75qXvoqbmjgdE6KpKK9wKGZwLGs5NBS	2025-10-23 23:31:29.620318-04	newuser-1761276689330@example.com	2025-10-23 23:31:29.620318-04	\N	\N
523187a0-d707-4e95-babf-dfb2ae5d361d	$2b$12$EHN/uMkThdJ3FbFOTT7m.OP2bKYq4zOjIaEJzHC1vHZomVbHdVcA.	2025-10-23 23:31:30.220981-04	authtest-1761276689943@example.com	2025-10-23 23:31:30.220981-04	\N	\N
c99e3ead-a0ec-4e8c-945f-1e054f167ac1	$2b$12$okD3i9WsYQ5eMsCXcYecNusZFYxRQxR7cl7EfCz5NH0WmVDiEUL5q	2025-10-24 16:16:41.701133-04	test2-1761337000757@example.com	2025-10-24 16:16:41.701133-04	\N	\N
15f8ebd2-5aeb-4dee-9a7c-d85670d11f9a	$2b$12$VnoxLklYoahuh0qAJLlKfOLmocVrBZZzHI8uTwwDHjxtiwBkzCPBO	2025-10-24 16:16:43.246902-04	newuser-1761337002969@example.com	2025-10-24 16:16:43.246902-04	\N	\N
17d9b95b-63e0-47b5-8957-3054236709d2	$2b$12$TuGvk3rYdhswJpYCugh8Yu6Ya0qgXYaXjPy.B5KbtCF3zZOTcjdzW	2025-10-24 16:16:44.05402-04	authtest-1761337003781@example.com	2025-10-24 16:16:44.05402-04	\N	\N
18b56671-cb0e-4dd2-aac2-fb059c0a9f59	$2b$10$QU21iS5gGoDghNsM2Rllv.SFLumGkcmDIw62Mu7yYnboKfsiSBgIa	2025-10-23 23:31:27.632833-04	test1-1761276687139@example.com	2025-10-23 23:31:31.739809-04	expired-token	2025-10-23 22:31:31.734
0faa846f-a687-40ee-bb14-5a4e53d40651	$2b$12$NIgvfnQXZKHYQrJR.U2/e.pDUof1ePaigzs8W9HwrPg6H3Zdq6FLS	2025-10-24 16:14:26.544865-04	test2-1761336865847@example.com	2025-10-24 16:14:26.544865-04	\N	\N
b22647e6-d694-47b2-a466-f72d9a449460	$2b$12$2FENuT74iKBU7a4/vt4R1.pylFwpDNHuwck5MPkVererqygrOJbxC	2025-10-24 16:14:27.948582-04	newuser-1761336867666@example.com	2025-10-24 16:14:27.948582-04	\N	\N
f9697bbc-651d-44cc-9581-5b0cbbacd587	$2b$12$LulGbOHcdBZEhk1/GXn9dOBidBhwHgqopDnIQZrn/mB8rv56sRBCu	2025-10-24 16:14:28.53175-04	authtest-1761336868247@example.com	2025-10-24 16:14:28.53175-04	\N	\N
ed4d5bb0-c683-4132-aecc-9eca6ff9646e	$2b$12$RKz2v5OneHfdrH5UVRXc/uB7wl6l6J1NK2zC3zt.NfgBdj6H8ELei	2025-10-26 15:46:22.16671-04	test2-1761507981414@example.com	2025-10-26 15:46:22.16671-04	\N	\N
000262ad-7b71-43df-821d-9bcfec1344fb	$2b$12$.UXp58rQ3VC4ZXTuNdKU7.yCZhbp4FxVjCj4IgGiy0PGs5UMXppky	2025-10-26 15:46:23.564228-04	newuser-1761507983278@example.com	2025-10-26 15:46:23.564228-04	\N	\N
20532026-7f45-4b97-8d99-e224a28d391d	$2b$12$fs.7/wHB6y3yBcfzpQPUJ.m5arH.CrUk5yTnIhi822KryZIKO6jkK	2025-10-26 15:46:24.179871-04	authtest-1761507983904@example.com	2025-10-26 15:46:24.179871-04	\N	\N
d16697eb-15e2-4c48-9265-8887d570c950	$2b$10$XScWVuUrO4eA.oSALq1WWuV6JuM19F6ZcbU/8zd6cfbUqiv1hNEgW	2025-10-24 16:14:26.242687-04	test1-1761336865847@example.com	2025-10-24 16:14:29.110997-04	expired-token	2025-10-24 15:14:29.109
328f3d0d-8148-485c-be33-702663a5bc6b	$2b$12$okaGzsrwnVZDfKFaghvl7eOYMTUxYcCRO1YUsZv1.TkzGa4qZ6s1.	2025-10-24 16:15:51.610478-04	test2-1761336950676@example.com	2025-10-24 16:15:51.610478-04	\N	\N
ce96fc5e-d480-4d2e-8c80-5bd8227a3483	$2b$12$1WBUpKmTzuyffDPhsUgfV.TKJvGZ4adNC.TY/0FCZtfOB2FW.rxjO	2025-10-24 16:15:53.261754-04	newuser-1761336952980@example.com	2025-10-24 16:15:53.261754-04	\N	\N
eda57561-115b-4e3e-8ddd-51dd1f102987	$2b$12$ziiKSWY0w4e..poGMYrBu.LTFzqMfsxdNG3D/MrIkllvq7NDNKB1.	2025-10-24 16:15:53.868753-04	authtest-1761336953596@example.com	2025-10-24 16:15:53.868753-04	\N	\N
17fe6321-d353-4d51-9303-0c83986def59	$2b$10$SMnwCwvECj3MvGxZrjPvjezfDd2kh87rLev8ssUI1CpKmAPVAGg.6	2025-10-24 16:16:41.267704-04	test1-1761337000757@example.com	2025-10-24 16:16:45.386877-04	expired-token	2025-10-24 15:16:45.386
1a16c4ca-9e0b-4ccb-b2c1-9eb0d9359731	$2b$12$SkOyZKnUKU3nBXVaVdNsvOQmOo1QCGHCYXJPpx7Q3DmbUnAOQPn/q	2025-10-24 16:17:00.618686-04	test2-1761337019661@example.com	2025-10-24 16:17:00.618686-04	\N	\N
3b36c0fc-13e3-429d-b971-ff5feee33417	$2b$10$z3agGULgI8/YslvrqaKdXO6dsXsjfaTjpWixnbhg4lgq4j/ZUp2cW	2025-10-24 16:15:51.185628-04	test1-1761336950676@example.com	2025-10-24 16:15:54.830743-04	expired-token	2025-10-24 15:15:54.828
e40af491-1c3a-415f-839d-25b95e02a371	$2b$12$248L9CYYMqh3cIChwUZ.sejSuElFEB2oyROS40jnR/mvOD3U20OtO	2025-10-24 16:16:13.890137-04	test2-1761336972855@example.com	2025-10-24 16:16:13.890137-04	\N	\N
5363b5db-a0bb-495b-83b5-c965aa7a0d48	$2b$12$F5kLZQD0a1uCIxyA7hmI2.u2kCcMVCbbyeGoN6K/3Ihj4dEAiMXSq	2025-10-24 16:16:15.576194-04	newuser-1761336975299@example.com	2025-10-24 16:16:15.576194-04	\N	\N
cdce5244-ecea-4556-b28d-bb3ae539e2cd	$2b$12$0056uua.V2d3mTIH.6yaIezAjx0MtGiMZ4NqLinDnZnU39MZc.j2u	2025-10-24 16:17:02.255317-04	newuser-1761337021976@example.com	2025-10-24 16:17:02.255317-04	\N	\N
21bc3291-188e-47d6-9cc7-d249d0d2f4b1	$2b$12$Yg7r1LyPR7ZiCO6WYLqHZujGhM/N6N7YpVQAw2okLmh20rBGQMOti	2025-10-24 16:17:02.911271-04	authtest-1761337022632@example.com	2025-10-24 16:17:02.911271-04	\N	\N
14036d30-7674-44b4-8d66-04f11ca4a6d8	$2b$10$W39DU1RXtojRksf/8MxxnOPQhRtNLjJ7RRglUUebO93oq/uUkezVy	2025-10-26 15:46:21.812958-04	test1-1761507981414@example.com	2025-10-26 15:46:24.998201-04	expired-token	2025-10-26 14:46:24.991
\.


--
-- TOC entry 4906 (class 2606 OID 16537)
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 16519)
-- Name: educations educations_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 16456)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (file_id);


--
-- TOC entry 4898 (class 2606 OID 16484)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16435)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4908 (class 2606 OID 16554)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16500)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 16502)
-- Name: skills skills_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);


--
-- TOC entry 4890 (class 2606 OID 16401)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4892 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (u_id);


--
-- TOC entry 4915 (class 2620 OID 16403)
-- Name: users lowercaseemail; Type: TRIGGER; Schema: public; Owner: superUser
--

CREATE TRIGGER lowercaseemail BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.lower_email();


--
-- TOC entry 4916 (class 2620 OID 16406)
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: superUser
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.addupdatetime();


--
-- TOC entry 4913 (class 2606 OID 16583)
-- Name: certifications certifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


--
-- TOC entry 4912 (class 2606 OID 16578)
-- Name: educations educations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 16568)
-- Name: jobs jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


--
-- TOC entry 4909 (class 2606 OID 16563)
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


--
-- TOC entry 4914 (class 2606 OID 16588)
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


--
-- TOC entry 4911 (class 2606 OID 16573)
-- Name: skills skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id) ON DELETE CASCADE;


-- Completed on 2025-10-27 20:56:29

--
-- PostgreSQL database dump complete
--

\unrestrict 8cefIDIueZbJCGs5T4fbr5dVkBaP2yCn4QkYQnRPgtlH2Wczna8vnATrfNB994p

