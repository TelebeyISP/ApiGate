import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

import { User } from './entities/user.entity';
import { Session } from '../sessions/entities/session.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { RedisService } from '../redis/redis.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;
const AT_TTL_S  = 15 * 60;           // 15 minutes
const RT_TTL_S  = 7 * 24 * 60 * 60;  // 7 days

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Session)
    private readonly sessions: Repository<Session>,
    @InjectRepository(AuditLog)
    private readonly auditLogs: Repository<AuditLog>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  // ─── Register ──────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const exists = await this.users.findOne({ where: { email } });
    if (exists) throw new ConflictException('An account with this email already exists');

    // Admin role is granted exclusively to @telebey.com email addresses
    const role = email.endsWith('@telebey.com') ? 'admin' : 'user';

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.users.save(
      this.users.create({ email, passwordHash, phone: dto.phone, role } as Partial<User>),
    );

    this.logger.log(`Registered ${role} ${user.id} (${user.email})`);
    return { id: user.id, email: user.email, role: user.role, created_at: user.createdAt };
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ip: string, userAgent?: string) {
    const email = dto.email.toLowerCase().trim();

    // Load user with password hash (select: false field)
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .andWhere('u.isActive = true')
      .getOne();

    // Consistent timing: compare even on "not found" to prevent user enumeration
    const dummyHash = '$2b$12$invalidhashtopreventtimingatk';
    const hash = user?.passwordHash ?? dummyHash;
    const match = await bcrypt.compare(dto.password, hash);

    if (!user || !match) {
      await this.audit(null, 'auth:login_failed', ip, { email, reason: !user ? 'user_not_found' : 'wrong_password' });
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user.id, user.email);

    // Store hashed RT in Redis
    const rtHash = await bcrypt.hash(tokens.refresh_token, 10);
    await this.redis.set(`refresh:${user.id}`, rtHash, RT_TTL_S);

    // Persist session row
    await this.sessions.save(
      this.sessions.create({
        user,
        tokenHash: rtHash,
        ipAddress: ip,
        userAgent: userAgent ?? null,
        expiresAt: addDays(new Date(), 7),
      }),
    );

    await this.audit(user, 'auth:login', ip);
    this.logger.log(`Login: ${user.email} from ${ip}`);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    };
  }

  // ─── Refresh ───────────────────────────────────────────────────────────────

  async refresh(userId: string, rawRefreshToken: string): Promise<TokenPair> {
    const storedHash = await this.redis.get(`refresh:${userId}`);

    if (!storedHash) {
      throw new ForbiddenException('Session expired. Please log in again.');
    }

    const matches = await bcrypt.compare(rawRefreshToken, storedHash);
    if (!matches) {
      // Reuse detected — kill the session entirely
      await this.redis.del(`refresh:${userId}`);
      throw new ForbiddenException('Refresh token reuse detected. Session revoked.');
    }

    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Access Denied');

    // Rotate: issue new pair, store new RT hash
    const tokens = await this.issueTokens(user.id, user.email);
    const newHash = await bcrypt.hash(tokens.refresh_token, 10);
    await this.redis.set(`refresh:${userId}`, newHash, RT_TTL_S);

    this.logger.debug(`Token rotated for user ${userId}`);
    return tokens;
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string, ip: string, atJti?: string): Promise<{ message: string }> {
    // Remove RT from Redis
    await this.redis.del(`refresh:${userId}`);

    // Blacklist current AT so it cannot be reused before expiry
    if (atJti) {
      await this.redis.blacklistToken(atJti, AT_TTL_S);
    }

    const user = await this.users.findOne({ where: { id: userId } });
    await this.audit(user ?? null, 'auth:logout', ip);
    this.logger.log(`Logout: ${userId}`);

    return { message: 'Logged out' };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const jti = uuidv4();

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, jti },
        { secret: this.config.get<string>('JWT_ACCESS_SECRET'), expiresIn: '15m' },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: this.config.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' },
      ),
    ]);

    return { access_token, refresh_token };
  }

  private async audit(
    user: User | null,
    action: string,
    ip: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.auditLogs.save(
        this.auditLogs.create({ user: user ?? undefined, action, ipAddress: ip, metadata }),
      );
    } catch (err) {
      this.logger.error(`Audit log failed [${action}]: ${String(err)}`);
    }
  }
}
