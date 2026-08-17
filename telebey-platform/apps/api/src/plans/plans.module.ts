import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan.entity';
import { Sim } from '../sim/entities/sim.entity';
import { GsmaModule } from '../gsma/gsma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Sim]),
    GsmaModule,
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
