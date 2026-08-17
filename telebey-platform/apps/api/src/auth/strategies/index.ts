import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// ─── Access Token Strategy ────────────────────────────────────────────────────

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET') ?? 'fallback_at_secret',
    });
  }

  validate(payload: { sub: string; email: string; jti?: string }) {
    // Return value is injected into req.user
    return { sub: payload.sub, email: payload.email, jti: payload.jti };
  }
}

// ─── Refresh Token Strategy ───────────────────────────────────────────────────

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET') ?? 'fallback_rt_secret',
      passReqToCallback: true,
    } as any);
  }

  validate(req: Request, payload: { sub: string; email: string }) {
    // Extract raw token from header for Redis comparison
    const rawToken = (req.get('authorization') ?? '').replace('Bearer', '').trim();
    return { sub: payload.sub, email: payload.email, refreshToken: rawToken };
  }
}
