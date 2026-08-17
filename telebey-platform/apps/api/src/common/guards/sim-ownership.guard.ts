import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sim } from '../../sim/entities/sim.entity';

@Injectable()
export class SimOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const simId = request.params.id;

    if (!user || !simId) return false;

    const sim = await this.simRepository.findOne({
      where: { id: simId },
      relations: ['user'],
    });

    if (!sim) return true; // Let the controller handle 404

    if (sim.user?.id !== user.sub) {
      throw new ForbiddenException('You do not own this SIM card');
    }

    return true;
  }
}
