import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GsmaGatewayService } from './gsma-gateway.service';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [GsmaGatewayService],
  exports: [GsmaGatewayService],
})
export class GsmaModule {}
