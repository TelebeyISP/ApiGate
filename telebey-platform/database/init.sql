-- ─────────────────────────────────────────────────────────────────────────────
-- Telebey PostgreSQL Initialization
-- Runs automatically on first container start via docker-entrypoint-initdb.d
-- ─────────────────────────────────────────────────────────────────────────────

-- The database telebey_db and user telebey are created by the POSTGRES_* env vars.
-- This script enables the pgcrypto extension and sets up the schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "users" (
  "id"            UUID         NOT NULL DEFAULT gen_random_uuid(),
  "email"         VARCHAR(255) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "phone"         VARCHAR(20),
  "role"          VARCHAR(20)  NOT NULL DEFAULT 'user',
  "is_active"     BOOLEAN      NOT NULL DEFAULT true,
  "is_deleted"    BOOLEAN      NOT NULL DEFAULT false,
  "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT "PK_users"       PRIMARY KEY ("id"),
  CONSTRAINT "UQ_users_email" UNIQUE ("email")
);

CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");

-- ─── sessions ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "sessions" (
  "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID         NOT NULL,
  "token_hash"  VARCHAR(255) NOT NULL,
  "ip_address"  VARCHAR(45),
  "user_agent"  TEXT,
  "expires_at"  TIMESTAMPTZ  NOT NULL,
  "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT "PK_sessions" PRIMARY KEY ("id"),
  CONSTRAINT "FK_sessions_user"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_sessions_user_id"    ON "sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_sessions_expires_at" ON "sessions" ("expires_at");

-- ─── audit_logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID,
  "action"      VARCHAR(100) NOT NULL,
  "ip_address"  VARCHAR(45),
  "metadata"    JSONB,
  "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"),
  CONSTRAINT "FK_audit_logs_user"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "IDX_audit_logs_user_id" ON "audit_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_audit_logs_action"  ON "audit_logs" ("action");

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trig_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE PROCEDURE fn_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Seed Data ────────────────────────────────────────────────────────────────
-- Password for both: Test1234! (user) and Admin1234! (admin)

INSERT INTO "users" ("id", "email", "password_hash", "phone", "role", "is_active", "is_deleted")
VALUES 
  (gen_random_uuid(), 'user@test.com', '$2b$12$JDn0VT.OeBfVSuBCo3GbXOHEAuA64/FjL8r3/AsP/tqHYrY3kLdJm', '+12025550001', 'user', true, false),
  (gen_random_uuid(), 'admin@telebey.com', '$2b$12$b3a80zN58b7Yq/HgUAEavORWynwunhpZrtUrcaRh0h.IvzuAXES/e', '+12025550002', 'admin', true, false)
ON CONFLICT ("email") DO NOTHING;
