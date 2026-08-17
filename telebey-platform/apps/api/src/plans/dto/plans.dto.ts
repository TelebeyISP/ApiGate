import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyPlanDto {
  @ApiProperty({ example: 'plan-id-uuid' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'sim-id-uuid' })
  @IsUUID()
  @IsNotEmpty()
  simId: string;
}
