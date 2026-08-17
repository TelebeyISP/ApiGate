import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../auth/entities/user.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

const BCRYPT_ROUNDS = 12;

// ─── Input Shapes ─────────────────────────────────────────────────────────────

export interface CreateUserInput {
  email: string;
  /** Plain text — will be hashed internally with bcrypt (rounds: 12) */
  password: string;
  phone?: string;
}

export interface LogAuditInput {
  user?: User | null;
  action: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  // ─── findByEmail ────────────────────────────────────────────────────────────
  /**
   * Look up a user by email address.
   * Normalises email to lowercase before querying.
   * Returns null if not found (no exception thrown).
   *
   * IMPORTANT: passwordHash is excluded from standard queries (select: false).
   * Pass `{ includePassword: true }` to get the hash for login verification.
   */
  async findByEmail(
    email: string,
    options: { includePassword?: boolean } = {},
  ): Promise<User | null> {
    const qb = this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase().trim() })
      .andWhere('user.isActive = true');

    if (options.includePassword) {
      qb.addSelect('user.passwordHash');
    }

    return qb.getOne();
  }

  // ─── createUser ─────────────────────────────────────────────────────────────
  /**
   * Hash the password and persist a new user.
   * Throws ConflictException (409) if the email is already taken.
   * Normalises email to lowercase before saving.
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const email = input.email.toLowerCase().trim();

    const existing = await this.repo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = this.repo.create({
      email,
      passwordHash,
      phone: input.phone ?? null,
    });

    const saved = await this.repo.save(user);
    this.logger.log(`User created: ${saved.email} (${saved.id})`);
    return saved;
  }

  // ─── logAudit ───────────────────────────────────────────────────────────────
  /**
   * Write a security audit log entry.
   * Intentionally swallows errors — audit failures must NEVER bring down auth flows.
   */
  async logAudit(input: LogAuditInput): Promise<void> {
    try {
      const entry = this.auditRepo.create({
        user: input.user ?? undefined,
        action: input.action,
        ipAddress: input.ipAddress ?? null,
        metadata: input.metadata ?? null,
      });
      await this.auditRepo.save(entry);
    } catch (err) {
      this.logger.error(
        `Audit log write failed [${input.action}]: ${String(err)}`,
      );
    }
  }

  // ─── Utility ────────────────────────────────────────────────────────────────

  /** Fetch the last N audit entries for a specific user */
  async getAuditHistory(userId: string, limit = 20): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /** Soft-deactivate a user without deleting the row */
  async deactivate(userId: string): Promise<void> {
    await this.repo.update(userId, { isActive: false });
  }
}
