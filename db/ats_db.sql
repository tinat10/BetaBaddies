--
-- PostgreSQL database dump
--

\restrict eEbNDGr4E2ZdQpmSLupBtTTfA3LmEXQnefCBQXwtsiirmzWa6a8JBKvzcEXQ3Du

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-16 20:28:50

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
    is_enrolled boolean NOT NULL
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
    start_date date NOT NULL,
    end_date date,
    is_current boolean DEFAULT false NOT NULL,
    description character varying(1000)
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
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
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

COPY public.educations (id, user_id, school, degree_type, field, honors, gpa, is_enrolled) FROM stdin;
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

COPY public.jobs (id, user_id, title, company, location, start_date, end_date, is_current, description) FROM stdin;
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

COPY public.users (u_id, password, created_at, email, updated_at) FROM stdin;
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
-- TOC entry 4913 (class 2606 OID 16538)
-- Name: certifications certifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


--
-- TOC entry 4912 (class 2606 OID 16520)
-- Name: educations educations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


--
-- TOC entry 4910 (class 2606 OID 16485)
-- Name: jobs jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


--
-- TOC entry 4909 (class 2606 OID 16436)
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


--
-- TOC entry 4914 (class 2606 OID 16555)
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


--
-- TOC entry 4911 (class 2606 OID 16503)
-- Name: skills skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: superUser
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(u_id);


-- Completed on 2025-10-16 20:28:51

--
-- PostgreSQL database dump complete
--

\unrestrict eEbNDGr4E2ZdQpmSLupBtTTfA3LmEXQnefCBQXwtsiirmzWa6a8JBKvzcEXQ3Du

