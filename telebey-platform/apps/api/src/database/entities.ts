import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * users table
 * Core identity record. Password is always stored as a bcrypt hash (rounds: 12).
 */
@Entity('users')
@Index('IDX_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  /** bcrypt hash — NEVER expose in responses */
  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ length: 20, nullable: true, default: null })
  phone: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────

import { ManyToOne, JoinColumn } from 'typeorm';

/**
 * sessions table
 * Stores bcrypt-hashed refresh tokens. One row = one active device session.
 */
@Entity('sessions')
@Index('IDX_sessions_user_id', ['user'])
@Index('IDX_sessions_expires_at', ['expiresAt'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** bcrypt hash of the raw refresh token */
  @Column({ name: 'token_hash', length: 255 })
  tokenHash: string;

  @Column({ name: 'ip_address', length: 45, nullable: true, default: null })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true, default: null })
  userAgent: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * audit_logs table
 * Append-only record of all security-sensitive actions.
 * user_id SET NULL on user deletion preserves audit history.
 */
@Entity('audit_logs')
@Index('IDX_audit_logs_user_id', ['user'])
@Index('IDX_audit_logs_action', ['action'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  /** e.g. 'auth:login', 'auth:logout', 'auth:register', 'sim:activate' */
  @Column({ length: 100 })
  action: string;

  @Column({ name: 'ip_address', length: 45, nullable: true, default: null })
  ipAddress: string | null;

  @Column({ type: 'jsonb', nullable: true, default: null })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
