import { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds the role column to the users table */
export class AddUserRole1710460848000 implements MigrationInterface {
  name = 'AddUserRole1710460848000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "role" VARCHAR(10) NOT NULL DEFAULT 'user'
    `);

    // Retroactively promote any existing @telebey.com accounts
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = 'admin'
      WHERE "email" LIKE '%@telebey.com'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role"`);
  }
}
