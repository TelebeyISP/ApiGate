import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTables1710460847000 implements MigrationInterface {
  name = 'CreateAuthTables1710460847000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Enable pgcrypto for gen_random_uuid() ───────────────────────────────
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // ─── TABLE: users ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID        NOT NULL DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255) NOT NULL,
        "password_hash" VARCHAR(255) NOT NULL,
        "phone"         VARCHAR(20),
        "is_active"     BOOLEAN     NOT NULL DEFAULT true,
        "is_deleted"    BOOLEAN     NOT NULL DEFAULT false,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // Index on email for fast lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // ─── TABLE: sessions ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "sessions" (
        "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
        "user_id"     UUID        NOT NULL,
        "token_hash"  VARCHAR(255) NOT NULL,
        "ip_address"  VARCHAR(45),
        "user_agent"  TEXT,
        "expires_at"  TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sessions_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sessions_user_id" ON "sessions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sessions_expires_at" ON "sessions" ("expires_at")
    `);

    // ─── TABLE: audit_logs ────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
        "user_id"     UUID,
        "action"      VARCHAR(100) NOT NULL,
        "ip_address"  VARCHAR(45),
        "metadata"    JSONB,
        "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action")
    `);

    // ─── Auto-update updated_at trigger ──────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_users_updated_at
        BEFORE UPDATE ON "users"
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_users_updated_at ON "users"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_logs_action"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_logs_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sessions_expires_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sessions_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sessions"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
