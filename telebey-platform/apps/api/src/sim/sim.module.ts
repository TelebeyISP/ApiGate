import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimController } from './sim.controller';
import { SimService } from './sim.service';
import { Sim } from './entities/sim.entity';
import { User } from '../auth/entities/user.entity';
import { Open5gsModule } from '../open5gs/open5gs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sim, User]), Open5gsModule],
  controllers: [SimController],
  providers: [SimService],
})
export class SimModule {}
