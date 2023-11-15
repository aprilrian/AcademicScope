--
-- PostgreSQL database dump
--
-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0
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
--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--
COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
SET default_tablespace = '';
SET default_table_access_method = heap;
--
-- Name: dosen; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.dosen (
    id integer NOT NULL,
    nip character varying(18) NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50),
    alamat character varying(100),
    phone character varying(12),
    user_id integer
);
ALTER TABLE public.dosen OWNER TO postgres;
--
-- Name: dosen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.dosen_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.dosen_id_seq OWNER TO postgres;
--
-- Name: dosen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.dosen_id_seq OWNED BY public.dosen.id;
--
-- Name: kabupaten; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.kabupaten (
    id integer NOT NULL,
    id_provinsi character varying,
    nama character varying
);
ALTER TABLE public.kabupaten OWNER TO postgres;
--
-- Name: kabupaten_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.kabupaten_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.kabupaten_id_seq OWNER TO postgres;
--
-- Name: kabupaten_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.kabupaten_id_seq OWNED BY public.kabupaten.id;
--
-- Name: khs; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.khs (
    id integer NOT NULL,
    semester_aktif integer NOT NULL,
    sks integer NOT NULL,
    sks_kumulatif integer NOT NULL,
    ip numeric(3, 2) NOT NULL,
    ip_kumulatif numeric(3, 2) NOT NULL,
    status_konfirmasi character varying(20),
    file character varying,
    mahasiswa_id integer
);
ALTER TABLE public.khs OWNER TO postgres;
--
-- Name: khs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.khs_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.khs_id_seq OWNER TO postgres;
--
-- Name: khs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.khs_id_seq OWNED BY public.khs.id;
--
-- Name: mahasiswa; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.mahasiswa (
    id integer NOT NULL,
    nim character varying(14) NOT NULL,
    name character varying(50) NOT NULL,
    angkatan character varying(4) NOT NULL,
    email character varying(50),
    alamat character varying(100),
    phone character varying(12),
    kodewali integer,
    kodekab character varying,
    status character varying,
    jalurmasuk character varying,
    user_id integer
);
ALTER TABLE public.mahasiswa OWNER TO postgres;
--
-- Name: mahasiswa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.mahasiswa_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.mahasiswa_id_seq OWNER TO postgres;
--
-- Name: mahasiswa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.mahasiswa_id_seq OWNED BY public.mahasiswa.id;
--
-- Name: pkl; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.pkl (
    id integer NOT NULL,
    nilai character varying(1),
    semester integer,
    status_konfirmasi character varying(20),
    file character varying,
    mahasiswa_id integer
);
ALTER TABLE public.pkl OWNER TO postgres;
--
-- Name: pkl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.pkl_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.pkl_id_seq OWNER TO postgres;
--
-- Name: pkl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.pkl_id_seq OWNED BY public.pkl.id;
--
-- Name: provinsi; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.provinsi (
    id integer NOT NULL,
    nama character varying
);
ALTER TABLE public.provinsi OWNER TO postgres;
--
-- Name: provinsi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.provinsi_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.provinsi_id_seq OWNER TO postgres;
--
-- Name: provinsi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.provinsi_id_seq OWNED BY public.provinsi.id;
--
-- Name: refreshTokens; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public."refreshTokens" (tokens character varying(512) NOT NULL);
ALTER TABLE public."refreshTokens" OWNER TO postgres;
--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying
);
ALTER TABLE public.role OWNER TO postgres;
--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.role_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.role_id_seq OWNER TO postgres;
--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;
--
-- Name: skripsi; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.skripsi (
    id integer NOT NULL,
    nilai character varying(1) NOT NULL,
    tanggal date NOT NULL,
    semester integer NOT NULL,
    status_konfirmasi character varying NOT NULL,
    file character varying,
    mahasiswa_id integer
);
ALTER TABLE public.skripsi OWNER TO postgres;
--
-- Name: skripsi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.skripsi_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.skripsi_id_seq OWNER TO postgres;
--
-- Name: skripsi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.skripsi_id_seq OWNED BY public.skripsi.id;
--
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.status (
    id integer NOT NULL,
    name character varying
);
ALTER TABLE public.status OWNER TO postgres;
--
-- Name: status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.status_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.status_id_seq OWNER TO postgres;
--
-- Name: status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;
--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL
);
ALTER TABLE public.users OWNER TO postgres;
--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.users_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNER TO postgres;
--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
--
-- Name: dosen id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.dosen
ALTER COLUMN id
SET DEFAULT nextval('public.dosen_id_seq'::regclass);
--
-- Name: kabupaten id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.kabupaten
ALTER COLUMN id
SET DEFAULT nextval('public.kabupaten_id_seq'::regclass);
--
-- Name: khs id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.khs
ALTER COLUMN id
SET DEFAULT nextval('public.khs_id_seq'::regclass);
--
-- Name: mahasiswa id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.mahasiswa
ALTER COLUMN id
SET DEFAULT nextval('public.mahasiswa_id_seq'::regclass);
--
-- Name: pkl id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.pkl
ALTER COLUMN id
SET DEFAULT nextval('public.pkl_id_seq'::regclass);
--
-- Name: provinsi id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.provinsi
ALTER COLUMN id
SET DEFAULT nextval('public.provinsi_id_seq'::regclass);
--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.role
ALTER COLUMN id
SET DEFAULT nextval('public.role_id_seq'::regclass);
--
-- Name: skripsi id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.skripsi
ALTER COLUMN id
SET DEFAULT nextval('public.skripsi_id_seq'::regclass);
--
-- Name: status id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.status
ALTER COLUMN id
SET DEFAULT nextval('public.status_id_seq'::regclass);
--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.users
ALTER COLUMN id
SET DEFAULT nextval('public.users_id_seq'::regclass);
--
-- Name: dosen dosen_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.dosen
ADD CONSTRAINT dosen_email_key UNIQUE (email);
--
-- Name: dosen dosen_nip_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.dosen
ADD CONSTRAINT dosen_nip_key UNIQUE (nip);
--
-- Name: dosen dosen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.dosen
ADD CONSTRAINT dosen_pkey PRIMARY KEY (id);
--
-- Name: kabupaten kabupaten_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.kabupaten
ADD CONSTRAINT kabupaten_pkey PRIMARY KEY (id);
--
-- Name: khs khs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.khs
ADD CONSTRAINT khs_pkey PRIMARY KEY (id);
--
-- Name: mahasiswa mahasiswa_nim_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.mahasiswa
ADD CONSTRAINT mahasiswa_nim_key UNIQUE (nim);
--
-- Name: mahasiswa mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.mahasiswa
ADD CONSTRAINT mahasiswa_pkey PRIMARY KEY (id);
--
-- Name: pkl pkl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.pkl
ADD CONSTRAINT pkl_pkey PRIMARY KEY (id);
--
-- Name: provinsi provinsi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.provinsi
ADD CONSTRAINT provinsi_pkey PRIMARY KEY (id);
--
-- Name: refreshTokens refreshTokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public."refreshTokens"
ADD CONSTRAINT "refreshTokens_pkey" PRIMARY KEY (tokens);
--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.role
ADD CONSTRAINT role_pkey PRIMARY KEY (id);
--
-- Name: skripsi skripsi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.skripsi
ADD CONSTRAINT skripsi_pkey PRIMARY KEY (id);
--
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.status
ADD CONSTRAINT status_pkey PRIMARY KEY (id);
--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);
--
-- Name: dosen dosen_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.dosen
ADD CONSTRAINT dosen_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
--
-- Name: khs khs_mahasiswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.khs
ADD CONSTRAINT khs_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa(id);
--
-- Name: mahasiswa mahasiswa_kodewali_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.mahasiswa
ADD CONSTRAINT mahasiswa_kodewali_fkey FOREIGN KEY (kodewali) REFERENCES public.dosen(id);
--
-- Name: mahasiswa mahasiswa_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.mahasiswa
ADD CONSTRAINT mahasiswa_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
--
-- Name: pkl pkl_mahasiswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.pkl
ADD CONSTRAINT pkl_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa(id);
--
-- Name: skripsi skripsi_mahasiswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.skripsi
ADD CONSTRAINT skripsi_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa(id);
-- Name: irs; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.irs (
    id integer NOT NULL,
    semester integer NOT NULL,
    mata_kuliah character varying(50) NOT NULL,
    sks integer NOT NULL,
    mahasiswa_id integer
);
ALTER TABLE public.irs OWNER TO postgres;
--
-- Name: irs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.irs_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.irs_id_seq OWNER TO postgres;
--
-- Name: irs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.irs_id_seq OWNED BY public.irs.id;
--
-- Name: irs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.irs
ADD CONSTRAINT irs_pkey PRIMARY KEY (id);
--
-- Name: irs_mahasiswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.irs
ADD CONSTRAINT irs_mahasiswa_id_fkey FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa(id);
--
-- PostgreSQL database dump complete
- -