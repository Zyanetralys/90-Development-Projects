-- ============================================================
-- DomConnect — Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecuta este SQL en el SQL Editor de Supabase
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USUARIOS ────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  age           INT NOT NULL CHECK (age >= 18),
  bio           TEXT,
  role          TEXT CHECK (role IN ('Dominante (Dom)', 'Sumisa (Sub)', 'Switch', 'Explorando')),
  province      TEXT,
  interests     TEXT[],           -- array de strings
  photo_url     TEXT,
  visible       BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LIKES / PASSES ──────────────────────────────────────────
CREATE TABLE likes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  super_like    BOOLEAN DEFAULT false,
  passed        BOOLEAN DEFAULT false,  -- true = "pass" (swipe izquierda)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (from_user_id, to_user_id)
);

-- ─── MATCHES ─────────────────────────────────────────────────
CREATE TABLE matches (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user1_id, user2_id)
);

-- ─── MENSAJES ────────────────────────────────────────────────
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BLOQUEOS ────────────────────────────────────────────────
CREATE TABLE blocks (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id)
);

-- ─── ÍNDICES ─────────────────────────────────────────────────
CREATE INDEX idx_likes_from       ON likes(from_user_id);
CREATE INDEX idx_likes_to         ON likes(to_user_id);
CREATE INDEX idx_matches_user1    ON matches(user1_id);
CREATE INDEX idx_matches_user2    ON matches(user2_id);
CREATE INDEX idx_messages_match   ON messages(match_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ─── ROW LEVEL SECURITY (Supabase) ───────────────────────────
ALTER TABLE users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks   ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo ven su propio registro completo
CREATE POLICY "users_own" ON users
  FOR ALL USING (auth.uid() = id);

-- Los usuarios pueden ver perfiles visibles de otros (solo campos públicos)
CREATE POLICY "users_discover" ON users
  FOR SELECT USING (visible = true);
