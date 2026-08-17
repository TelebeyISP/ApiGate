import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── Register ─────────────────────────────────────────────────────────────────

export class RegisterDto {
  @ApiProperty({ example: 'user@telebey.com' })
  @IsEmail({}, { message: 'Provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'Str0ng!Pass' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password: string;

  @ApiPropertyOptional({ example: '+12025550197' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, { message: 'Provide a valid international phone number' })
  phone?: string;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export class LoginDto {
  @ApiProperty({ example: 'user@telebey.com' })
  @IsEmail({}, { message: 'Provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'Str0ng!Pass' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

export class RefreshDto {
  @ApiPropertyOptional({ description: 'Refresh token. Optional when sent as an httpOnly cookie.' })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
