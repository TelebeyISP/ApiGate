import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SimModule } from './sim/sim.module';
import { PlansModule } from './plans/plans.module';
import { Open5gsModule } from './open5gs/open5gs.module';
import { GsmaModule } from './gsma/gsma.module';
import { RedisModule } from './redis/redis.module';
import { SecurityService } from './common/services/security.service';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

// Entities
import { User } from './auth/entities/user.entity';
import { Session } from './sessions/entities/session.entity';
import { AuditLog } from './audit-logs/entities/audit-log.entity';
import { Sim } from './sim/entities/sim.entity';
import { Plan } from './plans/entities/plan.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Payment } from './payments/entities/payment.entity';
import { Usage } from './usage/entities/usage.entity';

@Module({
  imports: [
    // Configuration (global)
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate Limiting — global default (overridden per-route where needed)
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username:
          config.get<string>('DB_USERNAME') ??
          config.get<string>('DB_USER', 'telebey_user'),
        password: config.get<string>('DB_PASSWORD', 'telebey_pass'),
        database: config.get<string>('DB_NAME', 'telebey_db'),
        entities: [User, Session, AuditLog, Sim, Plan, Subscription, Payment, Usage],
        autoLoadEntities: true,
        synchronize: true, // Disable in production (use migrations)
      }),
    }),

    // Feature Modules
    AuditLogsModule,
    RedisModule,
    AuthModule,
    SimModule,
    PlansModule,
    Open5gsModule,
    GsmaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SecurityService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
