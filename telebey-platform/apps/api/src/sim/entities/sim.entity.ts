import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Usage } from '../../usage/entities/usage.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum SimStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

@Entity('sims')
export class Sim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  iccid: string;

  @Column({ name: 'imsi', type: 'varchar', unique: true, length: 15, nullable: true })
  imsi: string | null;

  @Column({
    type: 'enum',
    enum: SimStatus,
    default: SimStatus.PENDING,
  })
  status: SimStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dataUsedMb: number;

  @ManyToOne(() => User, (user) => user.sims, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.sims, { nullable: true, onDelete: 'SET NULL' })
  plan: Plan;

  @OneToMany(() => Usage, (usage) => usage.sim)
  usages: Usage[];

  @OneToMany(() => Subscription, (sub) => sub.sim)
  subscriptions: Subscription[];

  @CreateDateColumn()
  activatedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
