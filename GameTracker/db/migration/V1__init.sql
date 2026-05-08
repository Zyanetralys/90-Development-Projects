CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE TABLE games (igdb_id VARCHAR(20) PRIMARY KEY, title VARCHAR(150) NOT NULL UNIQUE, cover_url TEXT, avg_rating NUMERIC(3,2), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_games_title_trgm ON games USING gin(title gin_trgm_ops);
CREATE TABLE game_roles (game_id VARCHAR(20) REFERENCES games(igdb_id) ON DELETE CASCADE, role VARCHAR(40) NOT NULL, PRIMARY KEY (game_id, role));
CREATE TABLE user_library (user_id VARCHAR(36) NOT NULL, game_id VARCHAR(20) REFERENCES games(igdb_id) ON DELETE CASCADE, status VARCHAR(12), rating INT CHECK (rating BETWEEN 1 AND 10), notes TEXT, PRIMARY KEY (user_id, game_id));
CREATE TABLE audit_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id VARCHAR(36), action VARCHAR(50), entity_type VARCHAR(50), entity_id VARCHAR(50), ip_address INET, old_data TEXT, new_data TEXT, timestamp TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_audit_user ON audit_logs(user_id);
