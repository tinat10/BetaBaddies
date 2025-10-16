--
-- PostgreSQL database dump
--

\restrict 8GRO5k3QvhkINUVLQM4QOrL7nh2QHZwTmXuL3pH3a2VMbyMUGImVUujjQk3iO84

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-15 22:26:12

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
-- TOC entry 222 (class 1255 OID 16404)
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
-- TOC entry 221 (class 1255 OID 16402)
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
-- TOC entry 220 (class 1259 OID 16407)
-- Name: profiles; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.profiles (
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    middle_name character varying(255),
    last_name character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character(2) NOT NULL,
    job_title character varying(255) NOT NULL,
    bio character varying(500),
    industry character varying(255),
    exp_level character varying(10)
);


ALTER TABLE public.profiles OWNER TO "superUser";

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: superUser
--

CREATE TABLE public.users (
    u_id uuid NOT NULL,
    password character(60) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO "superUser";

--
-- TOC entry 5020 (class 0 OID 16407)
-- Dependencies: 220
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.profiles (email, first_name, middle_name, last_name, phone, city, state, job_title, bio, industry, exp_level) FROM stdin;
\.


--
-- TOC entry 5019 (class 0 OID 16390)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: superUser
--

COPY public.users (u_id, password, created_at, email, updated_at) FROM stdin;
\.


--
-- TOC entry 4868 (class 2606 OID 16420)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (email);


--
-- TOC entry 4864 (class 2606 OID 16401)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4866 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (u_id);


--
-- TOC entry 4870 (class 2620 OID 16403)
-- Name: users lowercaseemail; Type: TRIGGER; Schema: public; Owner: superUser
--

CREATE TRIGGER lowercaseemail BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.lower_email();


--
-- TOC entry 4871 (class 2620 OID 16406)
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: superUser
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.addupdatetime();


--
-- TOC entry 4869 (class 2606 OID 16421)
-- Name: profiles profiles_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_fkey FOREIGN KEY (email) REFERENCES public.users(email);


-- Completed on 2025-10-15 22:26:12

--
-- PostgreSQL database dump complete
--

\unrestrict 8GRO5k3QvhkINUVLQM4QOrL7nh2QHZwTmXuL3pH3a2VMbyMUGImVUujjQk3iO84

