import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sim, SimStatus } from './entities/sim.entity';
import { ActivateSimDto } from './dto/sim.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SimService {
  constructor(
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async activate(dto: ActivateSimDto, userId: string) {
    const existingSim = await this.simRepository.findOne({ 
      where: [{ iccid: dto.iccid }, { imsi: dto.imsi }] 
    });
    
    if (existingSim) {
      if (existingSim.user) throw new ConflictException('SIM already activated');
      
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      existingSim.user = user;
      return this.simRepository.save(existingSim);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const sim = this.simRepository.create({
      iccid: dto.iccid,
      imsi: dto.imsi,
      user: user,
    });

    return this.simRepository.save(sim);
  }

  async getUsage(simId: string, userId: string) {
    const sim = await this.simRepository.findOne({ 
      where: { id: simId, user: { id: userId } } 
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');
    
    // In a real scenario, this might fetch from a telecom core API (Open5GS)
    return {
      simId: sim.id,
      iccid: sim.iccid,
      dataUsedMb: sim.dataUsedMb,
      isActive: sim.status === SimStatus.ACTIVE,
      lastUpdated: sim.updatedAt,
    };
  }

  async block(simId: string, userId: string) {
    const sim = await this.simRepository.findOne({ 
      where: { id: simId, user: { id: userId } } 
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');

    sim.status = SimStatus.BLOCKED;
    return this.simRepository.save(sim);
  }

  async findOne(id: string, userId: string) {
    const sim = await this.simRepository.findOne({ 
      where: { id, user: { id: userId } },
      relations: ['plan'],
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');
    return sim;
  }

  async findAll(userId: string) {
    return this.simRepository.find({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { updatedAt: 'DESC' },
    });
  }
}
