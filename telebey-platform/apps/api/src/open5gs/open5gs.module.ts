import { Module } from '@nestjs/common';
import { Open5gsSubscriberService } from './open5gs.service';

@Module({
  providers: [Open5gsSubscriberService],
  exports: [Open5gsSubscriberService],
})
export class Open5gsModule {}
