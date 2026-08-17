import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;    // user UUID
  email: string;
  jti: string;    // unique token ID for blacklisting
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET') ?? 'dev_access_secret_change_me',
    });
  }

  /**
   * Called after Passport verifies the token signature and expiry.
   * Return value is injected into req.user.
   */
  validate(payload: JwtPayload): JwtPayload {
    if (!payload?.sub) throw new UnauthorizedException('Invalid token payload');
    return { sub: payload.sub, email: payload.email, jti: payload.jti };
  }
}
