import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';

export interface SyliusJwtPayload {
  iat: number;
  exp: number;
  roles: string[];
  username: string; // This is the user's email in Sylius
}

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class SyliusJwtStrategy extends PassportStrategy(Strategy, 'sylius-jwt') {
  private readonly logger = new Logger(SyliusJwtStrategy.name);

  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const publicKeyPath = config.get<string>('SYLIUS_PUBLIC_KEY_PATH');
    let publicKey: string;

    try {
      if (!publicKeyPath) {
        throw new Error('SYLIUS_PUBLIC_KEY_PATH is not defined');
      }
      publicKey = fs.readFileSync(publicKeyPath, 'utf8');
      Logger.log(`Loaded Sylius public key from ${publicKeyPath}`, 'SyliusJwtStrategy');
    } catch (error) {
      Logger.warn(`Failed to load Sylius public key: ${error.message}. This is expected if Sylius is still starting up.`, 'SyliusJwtStrategy');
      publicKey = '---EMPTY---'; 
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  /**
   * Called after Passport verifies the token signature and expiry.
   * Return value is injected into req.user.
   */
  async validate(payload: SyliusJwtPayload): Promise<any> {
    if (!payload?.username) {
      throw new UnauthorizedException('Invalid Sylius token payload');
    }

    // Lookup the user in NestJS DB by email from Sylius
    const user = await this.userRepository.findOne({ 
      where: { email: payload.username.toLowerCase() } 
    });

    if (!user) {
      this.logger.warn(`User ${payload.username} authenticated via Sylius but not found in NestJS DB`);
      throw new UnauthorizedException('User profile not synchronized');
    }

    return {
      sub: user.id,
      email: user.email,
      roles: payload.roles,
      source: 'sylius',
    };
  }
}
