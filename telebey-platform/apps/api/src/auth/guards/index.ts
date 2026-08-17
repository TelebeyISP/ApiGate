import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../../redis/redis.service';

/** Guard for Access Tokens — also checks the Redis blacklist */
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private redis: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First run the standard Passport JWT guard
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    // Then check if the token's JTI has been blacklisted (post-logout)
    const request = context.switchToHttp().getRequest<{ user?: { jti?: string } }>();
    const jti = request.user?.jti;
    if (jti && (await this.redis.isBlacklisted(jti))) {
      return false;
    }

    return true;
  }
}

/** Guard for Refresh Tokens */
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {}
