/**
 * Telebey Seed Script
 * Creates a test user and an admin user in the database.
 * Run with: npx ts-node src/database/seed.ts
 *
 * Admin: any email @telebey.com (enforced by AuthService)
 * User:  any other email
 */
import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from '../auth/entities/user.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { Session } from '../sessions/entities/session.entity';

const ROUNDS = 12;

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER     ?? 'telebey',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME     ?? 'telebey_db',
  entities: [User, Session, AuditLog],
  synchronize: false,
});

const SEEDS = [
  {
    email:    'user@test.com',
    password: 'Test1234!',
    phone:    '+12025550001',
    role:     'user' as const,
  },
  {
    email:    'admin@telebey.com',
    password: 'Admin1234!',
    phone:    '+12025550002',
    role:     'admin' as const,  // @telebey.com → admin
  },
];

async function seed() {
  await ds.initialize();
  const repo = ds.getRepository(User);

  for (const s of SEEDS) {
    const existing = await repo.findOne({ where: { email: s.email } });
    if (existing) {
      console.log(`⏭  Skipping ${s.email} — already exists`);
      continue;
    }

    const passwordHash = await bcrypt.hash(s.password, ROUNDS);
    await repo.save(repo.create({
      email: s.email,
      passwordHash,
      phone: s.phone,
      role: s.role,
      isActive: true,
    }));
    console.log(`✅ Created ${s.role}: ${s.email} / ${s.password}`);
  }

  await ds.destroy();
  console.log('\n🌱 Seed complete.');
}

seed().catch(err => { console.error(err); process.exit(1); });
