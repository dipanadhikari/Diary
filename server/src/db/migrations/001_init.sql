CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  position      TEXT,
  role_title    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE daily_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date    DATE NOT NULL,
  is_day_off    BOOLEAN NOT NULL DEFAULT false,
  location      TEXT,
  work_done     TEXT,
  learned       TEXT,
  plan_tomorrow TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date),
  CHECK (entry_date BETWEEN DATE '2026-10-12' AND DATE '2027-05-14'),
  CHECK (EXTRACT(ISODOW FROM entry_date) BETWEEN 1 AND 5)
);

CREATE TABLE entry_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id     UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
  storage_key  TEXT NOT NULL,
  file_name    TEXT,
  content_type TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reminders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  deadline     DATE NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  is_done      BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_entries_user_date ON daily_entries (user_id, entry_date);
CREATE INDEX idx_reminders_open ON reminders (user_id, deadline) WHERE is_done = false;
CREATE INDEX idx_entries_search ON daily_entries USING GIN (
  to_tsvector('english', coalesce(work_done,'') || ' ' || coalesce(learned,'') || ' ' || coalesce(plan_tomorrow,'') || ' ' || coalesce(location,''))
);

INSERT INTO users (email, password_hash, full_name, position, role_title)
VALUES (
  'admin@site-diary.com',
  '$2a$10$8mV2B2hWwuyLQwq9w3/9yu8QQz8lP8Qo9dJ1Ov0bYTu0b6mQuXvKq',
  'Admin User',
  'Student Placement Site Engineer',
  'Junior Site Engineer'
);
