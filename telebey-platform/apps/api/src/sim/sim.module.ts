import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimController } from './sim.controller';
import { SimService } from './sim.service';
import { Sim } from './entities/sim.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sim, User])],
  controllers: [SimController],
  providers: [SimService],
})
export class SimModule {}
