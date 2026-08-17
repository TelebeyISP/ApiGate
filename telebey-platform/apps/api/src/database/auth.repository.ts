import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';

import { User } from '../auth/entities/user.entity';
import { Session } from '../sessions/entities/session.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  phone?: string;
}

export interface SaveSessionInput {
  user: User;
  rawToken: string;        // Will be hashed before storage
  ipAddress?: string;
  userAgent?: string;
  expiresInDays?: number;  // Default: 7
}

export interface LogAuditInput {
  user?: User | null;
  action: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  // ─── User Methods ──────────────────────────────────────────────────────────

  /**
   * Find a user by email. Returns null if not found.
   * Excludes soft-deleted users by default.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email: email.toLowerCase().trim(), isDeleted: false },
    });
  }

  /**
   * Find a user by their UUID.
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id, isDeleted: false },
    });
  }

  /**
   * Create and persist a new user.
   * Normalises email to lowercase before saving.
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const user = this.userRepo.create({
      email: input.email.toLowerCase().trim(),
      passwordHash: input.passwordHash,
      phone: input.phone,
    });
    return this.userRepo.save(user);
  }

  /**
   * Soft-delete a user (sets isDeleted = true and isActive = false).
   */
  async softDeleteUser(userId: string): Promise<void> {
    await this.userRepo.update(userId, { isDeleted: true, isActive: false });
  }

  // ─── Session Methods ───────────────────────────────────────────────────────

  /**
   * Save a hashed refresh token as a session record.
   * Returns the created Session.
   */
  async saveSession(input: SaveSessionInput): Promise<Session> {
    const tokenHash = await bcrypt.hash(input.rawToken, 10);
    const expiresAt = addDays(new Date(), input.expiresInDays ?? 7);

    const session = this.sessionRepo.create({
      user: input.user,
      tokenHash,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      expiresAt,
    });

    return this.sessionRepo.save(session);
  }

  /**
   * Find a valid (non-expired) session by user ID and raw token.
   * Returns null if token is invalid or session is expired.
   */
  async findSession(userId: string, rawToken: string): Promise<Session | null> {
    const sessions = await this.sessionRepo.find({
      where: { user: { id: userId }, expiresAt: LessThan(new Date()) },
      relations: ['user'],
    });

    for (const session of sessions) {
      const matches = await bcrypt.compare(rawToken, session.tokenHash);
      if (matches) return session;
    }

    return null;
  }

  /**
   * Delete a session record (used on logout or token rotation).
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionRepo.delete(sessionId);
  }

  /**
   * Delete all sessions for a user (force logout from all devices).
   */
  async deleteAllSessions(userId: string): Promise<void> {
    await this.sessionRepo.delete({ user: { id: userId } });
  }

  /**
   * Remove expired sessions from the database (run periodically).
   */
  async purgeExpiredSessions(): Promise<number> {
    const result = await this.sessionRepo.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected ?? 0;
  }

  // ─── Audit Methods ─────────────────────────────────────────────────────────

  /**
   * Write an audit log entry.
   * Swallows errors to prevent audit failures from crashing requests.
   */
  async logAudit(input: LogAuditInput): Promise<void> {
    try {
      const log = this.auditRepo.create({
        user: input.user ?? undefined,
        action: input.action,
        ipAddress: input.ipAddress,
        metadata: input.metadata,
      });
      await this.auditRepo.save(log);
    } catch (err) {
      this.logger.error(`Audit log write failed for action "${input.action}": ${String(err)}`);
    }
  }

  /**
   * Retrieve the last N audit log entries for a user.
   */
  async getUserAuditHistory(userId: string, limit = 20): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
