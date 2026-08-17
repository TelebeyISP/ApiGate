import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index, OneToMany,
} from 'typeorm';
import { Sim } from '../../sim/entities/sim.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Session } from '../../sessions/entities/session.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { Payment } from '../../payments/entities/payment.entity';

export type UserRole = 'user' | 'admin';

@Entity('users')
@Index('IDX_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  /** bcrypt hash — select: false keeps this out of default queries */
  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  phone: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  /**
   * Role: 'admin' is auto-assigned when email domain is @telebey.com.
   * All other emails get 'user'.
   */
  @Column({ type: 'varchar', length: 10, default: 'user' })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Sim, (sim) => sim.user)
  sims: Sim[];

  @OneToMany(() => Subscription, (sub) => sub.user)
  subscriptions: Subscription[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
