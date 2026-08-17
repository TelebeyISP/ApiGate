import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateSimDto {
  @ApiProperty({ example: '8901234567890123456' })
  @IsString()
  @IsNotEmpty()
  @Length(19, 20)
  iccid: string;

  @ApiProperty({ example: '310260000000001' })
  @IsString()
  @IsNotEmpty()
  @Length(15, 15)
  imsi: string;
}
