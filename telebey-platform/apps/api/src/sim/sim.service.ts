import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sim, SimStatus } from './entities/sim.entity';
import { ActivateSimDto } from './dto/sim.dto';
import { User } from '../auth/entities/user.entity';
import { Open5gsSubscriberService } from '../open5gs/open5gs.service';

@Injectable()
export class SimService {
  private readonly logger = new Logger(SimService.name);

  constructor(
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly open5gs: Open5gsSubscriberService,
  ) {}

  async activate(dto: ActivateSimDto, userId: string) {
    const existingSim = await this.simRepository.findOne({
      where: [{ iccid: dto.iccid }, { imsi: dto.imsi }],
      relations: ['user', 'plan'],
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (existingSim) {
      if (existingSim.user && existingSim.user.id !== userId) {
        throw new ConflictException('SIM already activated');
      }
      existingSim.user = user;
      existingSim.status = SimStatus.ACTIVE;
      await this.provisionOpen5gs(dto);
      return this.simRepository.save(existingSim);
    }

    const sim = this.simRepository.create({
      iccid: dto.iccid,
      imsi: dto.imsi,
      user,
      status: SimStatus.ACTIVE,
    });

    await this.provisionOpen5gs(dto);
    return this.simRepository.save(sim);
  }

  async getUsage(simId: string, userId: string) {
    const sim = await this.simRepository.findOne({
      where: { id: simId, user: { id: userId } },
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');

    const core = sim.imsi ? await this.open5gs.getSubscriber(sim.imsi).catch(() => null) : null;

    return {
      simId: sim.id,
      iccid: sim.iccid,
      imsi: sim.imsi,
      dataUsedMb: Number(sim.dataUsedMb),
      isActive: sim.status === SimStatus.ACTIVE,
      lastUpdated: sim.updatedAt,
      open5gs: core
        ? {
            imsi: core.imsi,
            subscriberStatus: core.subscriber_status,
            apn: core.slice?.[0]?.session?.[0]?.name ?? null,
          }
        : null,
    };
  }

  async block(simId: string, userId: string) {
    const sim = await this.simRepository.findOne({
      where: { id: simId, user: { id: userId } },
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');

    sim.status = SimStatus.BLOCKED;
    if (sim.imsi) {
      await this.open5gs.updateSubscriberStatus(sim.imsi, 1);
    }
    return this.simRepository.save(sim);
  }

  async findOne(id: string, userId: string) {
    const sim = await this.simRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['plan'],
    });
    if (!sim) throw new NotFoundException('SIM not found or unauthorized');

    const core = sim.imsi ? await this.open5gs.getSubscriber(sim.imsi).catch(() => null) : null;
    return { ...sim, open5gs: core };
  }

  async findAll(userId: string) {
    return this.simRepository.find({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { updatedAt: 'DESC' },
    });
  }

  private async provisionOpen5gs(dto: ActivateSimDto) {
    try {
      await this.open5gs.registerSubscriber({
        imsi: dto.imsi,
        ki: dto.ki,
        opc: dto.opc,
        apn: dto.apn,
        msisdn: dto.msisdn,
      });
    } catch (error) {
      this.logger.error(
        `Open5GS provision failed for IMSI ${dto.imsi}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }
}
