import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sim } from '../../sim/entities/sim.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  dataLimitMb: number;

  @Column({ type: 'int' })
  priceCents: number;

  @Column({ type: 'int' })
  validityDays: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Sim, (sim) => sim.plan)
  sims: Sim[];

  @OneToMany(() => Subscription, (sub) => sub.plan)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
