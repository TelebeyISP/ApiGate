import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SyliusJwtStrategy } from './sylius-jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Session } from '../sessions/entities/session.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Secrets are provided per-call from ConfigService — JwtModule just needs to exist
    JwtModule.register({}),

    // Register entities used directly in this module
    TypeOrmModule.forFeature([User, Session, AuditLog]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SyliusJwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    SyliusJwtStrategy,
  ],
})
export class AuthModule {}
