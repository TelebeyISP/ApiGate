import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivateSimDto {
  @ApiProperty({ example: '8901234567890123456' })
  @IsString()
  @IsNotEmpty()
  @Length(19, 20)
  iccid: string;

  @ApiProperty({ example: '001010000000001' })
  @IsString()
  @IsNotEmpty()
  @Length(15, 15)
  imsi: string;

  @ApiPropertyOptional({ example: '465B5CE8B199B49FAA5F0A2EE238A6BC' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9A-Fa-f]{32}$/, { message: 'ki must be a 32-character hex string' })
  ki?: string;

  @ApiPropertyOptional({ example: 'E8ED289DEBA952E4283B54E88E6183CA' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9A-Fa-f]{32}$/, { message: 'opc must be a 32-character hex string' })
  opc?: string;

  @ApiPropertyOptional({ example: 'internet' })
  @IsOptional()
  @IsString()
  apn?: string;

  @ApiPropertyOptional({ example: '12025550197' })
  @IsOptional()
  @IsString()
  msisdn?: string;
}
