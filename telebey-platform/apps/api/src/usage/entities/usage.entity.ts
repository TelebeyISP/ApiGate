import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Sim } from '../../sim/entities/sim.entity';

@Entity('usage')
export class Usage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sim, (sim) => sim.usages, { onDelete: 'CASCADE' })
  sim: Sim;

  @Column({ type: 'float' })
  dataUsedMb: number;

  @Column({ type: 'timestamp with time zone' })
  sessionStart: Date;

  @Column({ type: 'timestamp with time zone' })
  sessionEnd: Date;

  @CreateDateColumn()
  createdAt: Date;
}
