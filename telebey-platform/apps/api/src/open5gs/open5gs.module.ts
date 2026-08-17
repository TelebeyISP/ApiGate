import { Module } from '@nestjs/common';
import { Open5gsSubscriberService } from './open5gs.service';
import { Open5gsController } from './open5gs.controller';

@Module({
  controllers: [Open5gsController],
  providers: [Open5gsSubscriberService],
  exports: [Open5gsSubscriberService],
})
export class Open5gsModule {}
