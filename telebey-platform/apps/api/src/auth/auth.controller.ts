import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import * as express from 'express';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './jwt.strategy';

function extractIp(req: any): string {
  return (
    (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown'
  );
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── POST /auth/register ───────────────────────────────────────────────────

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ── POST /auth/login ──────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 req/min per IP
  @ApiOperation({ summary: 'Login and receive JWT access + refresh token pair' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: express.Request,
    @Headers('user-agent') userAgent?: string,
  ) {
    const ip = extractIp(req);
    const result = await this.authService.login(dto, ip, userAgent);

    // Set high-security httpOnly cookie for the dashboard middleware
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  // ── POST /auth/refresh ────────────────────────────────────────────────────
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  @ApiResponse({ status: 200, description: 'Tokens rotated' })
  @ApiResponse({ status: 403, description: 'Session expired or reuse detected' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    // Try to get token from body first, then fallback to cookie
    const token = dto.refresh_token || req.cookies?.refresh_token;

    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Malformed refresh token');
    }
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString(),
    ) as { sub: string };

    const tokens = await this.authService.refresh(payload.sub, token);

    // Update the cookie with the newly rotated refresh token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return tokens;
  }

  // ── POST /auth/logout ─────────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalidate session and blacklist access token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const ip = extractIp(req);
    
    // Clear the refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return this.authService.logout(req.user.sub, ip, req.user.jti);
  }

  // ── GET /auth/me ──────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns the authenticated user profile' })
  me(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
