import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { Sim, SimStatus } from '../sim/entities/sim.entity';
import { BuyPlanDto } from './dto/plans.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
  ) {}

  async findAll() {
    return this.planRepository.find({ where: { isActive: true } });
  }

  async buyPlan(dto: BuyPlanDto, userId: string) {
    const plan = await this.planRepository.findOne({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const sim = await this.simRepository.findOne({ 
      where: { id: dto.simId, user: { id: userId } } 
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');

    sim.status = SimStatus.ACTIVE;
    sim.plan = plan;
    return this.simRepository.save(sim);
  }
}
