import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env for the CLI (typeorm:migration commands)
dotenv.config({ path: '.env' });

import { User } from '../auth/entities/user.entity';
import { Session } from '../sessions/entities/session.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { Sim } from '../sim/entities/sim.entity';
import { Plan } from '../plans/entities/plan.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'telebey_user',
  password: process.env.DB_PASSWORD ?? 'telebey_pass',
  database: process.env.DB_NAME ?? 'telebey',
  entities: [User, Session, AuditLog, Sim, Plan],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // NEVER true in production
  logging: process.env.NODE_ENV === 'development',
});
