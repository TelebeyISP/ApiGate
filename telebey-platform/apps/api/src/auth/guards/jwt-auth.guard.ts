import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../../redis/redis.service';

/**
 * JwtAuthGuard
 * -----------
 * Extends Passport's JWT guard to also check the access-token blacklist in Redis.
 * A token is blacklisted when the user calls POST /auth/logout.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'sylius-jwt']) {
  constructor(private readonly redis: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Run standard JWT verification (signature + expiry)
    const canActivate = await (super.canActivate(context) as Promise<boolean>);
    if (!canActivate) return false;

    // 2. Reject tokens that have been blacklisted after logout
    const req = context.switchToHttp().getRequest<{ user?: { jti?: string } }>();
    const jti = req.user?.jti;
    if (jti && (await this.redis.isBlacklisted(jti))) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    return true;
  }

  /** Override to throw a clean UnauthorizedException instead of Passport default */
  handleRequest<T>(err: Error | null, user: T): T {
    if (err || !user) {
      throw new UnauthorizedException(err?.message ?? 'Access token is missing or invalid');
    }
    return user;
  }
}
