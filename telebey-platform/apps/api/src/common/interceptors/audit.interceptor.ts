import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { SecurityService } from '../services/security.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private securityService: SecurityService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, user } = request;

    return next.handle().pipe(
      tap(async (response) => {
        // Only log non-GET requests for mutation tracking
        if (method !== 'GET' || url.includes('verify')) {
          const action = `${method} ${url}`;
          const payloadHash = body ? this.securityService.hashPayload(body) : null;

          const log = this.auditLogRepository.create({
            user: user?.sub ? { id: user.sub } as any : null,
            action,
            ipAddress: ip,
            metadata: {
              method,
              url,
              payloadHash,
              status: context.switchToHttp().getResponse().statusCode,
            },
          });

          try {
            await this.auditLogRepository.save(log);
          } catch (error) {
            this.logger.error(`Failed to save audit log: ${error.message}`);
          }
        }
      }),
    );
  }
}
