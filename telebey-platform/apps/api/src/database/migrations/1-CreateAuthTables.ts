import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreateAuthTables
 * Creates the core authentication tables for the Telebey platform.
 * All statements are idempotent — safe to run on an existing database.
 */
export class CreateAuthTables1710460847001 implements MigrationInterface {
  name = 'CreateAuthTables1710460847001';

  // ─── UP ────────────────────────────────────────────────────────────────────
  public async up(queryRunner: QueryRunner): Promise<void> {
    // pgcrypto provides gen_random_uuid()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // ── users ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"            UUID         NOT NULL DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255) NOT NULL,
        "password_hash" VARCHAR(255) NOT NULL,
        "phone"         VARCHAR(20),
        "is_active"     BOOLEAN      NOT NULL DEFAULT true,
        "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users"    PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")`,
    );

    // Auto-increment updated_at on every UPDATE
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TRIGGER trig_users_updated_at
          BEFORE UPDATE ON "users"
          FOR EACH ROW EXECUTE PROCEDURE fn_set_updated_at();
      EXCEPTION WHEN duplicate_object THEN NULL; END $$
    `);

    // ── sessions ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
        "user_id"     UUID         NOT NULL,
        "token_hash"  VARCHAR(255) NOT NULL,
        "ip_address"  VARCHAR(45),
        "user_agent"  TEXT,
        "expires_at"  TIMESTAMPTZ  NOT NULL,
        "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sessions_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sessions_user_id"   ON "sessions" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sessions_expires_at" ON "sessions" ("expires_at")`,
    );

    // ── audit_logs ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
        "user_id"     UUID,
        "action"      VARCHAR(100) NOT NULL,
        "ip_address"  VARCHAR(45),
        "metadata"    JSONB,
        "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_logs_action"  ON "audit_logs" ("action")`,
    );
  }

  // ─── DOWN ──────────────────────────────────────────────────────────────────
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER  IF EXISTS trig_users_updated_at ON "users"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_set_updated_at`);
    await queryRunner.query(`DROP INDEX    IF EXISTS "IDX_audit_logs_action"`);
    await queryRunner.query(`DROP INDEX    IF EXISTS "IDX_audit_logs_user_id"`);
    await queryRunner.query(`DROP TABLE    IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP INDEX    IF EXISTS "IDX_sessions_expires_at"`);
    await queryRunner.query(`DROP INDEX    IF EXISTS "IDX_sessions_user_id"`);
    await queryRunner.query(`DROP TABLE    IF EXISTS "sessions"`);
    await queryRunner.query(`DROP INDEX    IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE    IF EXISTS "users"`);
  }
}
