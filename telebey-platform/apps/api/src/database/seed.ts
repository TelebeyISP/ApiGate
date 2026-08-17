/**
 * Telebey Seed Script
 * Creates demo users and data plans.
 * Run with: npm run seed
 */
import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from '../auth/entities/user.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { Session } from '../sessions/entities/session.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Sim } from '../sim/entities/sim.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Usage } from '../usage/entities/usage.entity';
import { Payment } from '../payments/entities/payment.entity';

const ROUNDS = 12;

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username:
    process.env.DB_USERNAME ?? process.env.DB_USER ?? 'telebey_user',
  password: process.env.DB_PASSWORD ?? 'telebey_pass',
  database: process.env.DB_NAME ?? 'telebey_db',
  entities: [User, Session, AuditLog, Plan, Sim, Subscription, Usage, Payment],
  synchronize: true,
});

const USER_SEEDS = [
  {
    email: 'user@test.com',
    password: 'Test1234!',
    phone: '+12025550001',
    role: 'user' as const,
  },
  {
    email: 'admin@telebey.com',
    password: 'Admin1234!',
    phone: '+12025550002',
    role: 'admin' as const,
  },
];

const PLAN_SEEDS = [
  {
    name: 'Lite',
    description: '5G access with EU roaming and no contract.',
    dataLimitMb: 5 * 1024,
    priceCents: 999,
    validityDays: 30,
    isActive: true,
  },
  {
    name: 'Standard',
    description: 'World roaming and priority support.',
    dataLimitMb: 20 * 1024,
    priceCents: 2499,
    validityDays: 30,
    isActive: true,
  },
  {
    name: 'Unlimited',
    description: '5G ultrawide global data with family sharing.',
    dataLimitMb: 1024 * 1024,
    priceCents: 4999,
    validityDays: 30,
    isActive: true,
  },
];

async function seed() {
  await ds.initialize();
  const users = ds.getRepository(User);
  const plans = ds.getRepository(Plan);

  for (const s of USER_SEEDS) {
    const existing = await users.findOne({ where: { email: s.email } });
    if (existing) {
      console.log(`Skipping ${s.email} — already exists`);
      continue;
    }

    const passwordHash = await bcrypt.hash(s.password, ROUNDS);
    await users.save(
      users.create({
        email: s.email,
        passwordHash,
        phone: s.phone,
        role: s.role,
        isActive: true,
      }),
    );
    console.log(`Created ${s.role}: ${s.email} / ${s.password}`);
  }

  for (const plan of PLAN_SEEDS) {
    const existing = await plans.findOne({ where: { name: plan.name } });
    if (existing) {
      console.log(`Skipping plan ${plan.name} — already exists`);
      continue;
    }
    await plans.save(plans.create(plan));
    console.log(`Created plan ${plan.name}`);
  }

  await ds.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
