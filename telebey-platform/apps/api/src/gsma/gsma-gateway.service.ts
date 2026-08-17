import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';

export interface GsmaResponse<T = any> {
  data: T;
  status: number;
}

export interface NumberVerificationRequest {
  phoneNumber: string;
}

export interface SimSwapCheckRequest {
  phoneNumber: string;
  maxAge?: number;
}

export interface LocationVerificationRequest {
  phoneNumber: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface QosSessionRequest {
  phoneNumber: string;
  qosProfile: string;
  duration?: number;
}

@Injectable()
export class GsmaGatewayService {
  private readonly logger = new Logger(GsmaGatewayService.name);
  private axiosClient: any;

  constructor(
    private configService: ConfigService,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {
    const baseURL = this.configService.get<string>('GSMA_GATEWAY_BASE_URL');
    this.axiosClient = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  private async getAccessToken(): Promise<string> {
    // CAMARA OAuth 2.0 implementation
    const clientId = this.configService.get<string>('GSMA_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GSMA_CLIENT_SECRET');
    
    try {
      const response = await axios.post<{ access_token: string }>(`${(this.axiosClient as any).defaults.baseURL}/oauth2/token`, {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'openid number-verification sim-swap device-location qos',
      });
      return response.data.access_token;
    } catch (error) {
      this.logError('OAuth Token Request Failed', error);
      throw new HttpException('Gateway Authentication Failed', HttpStatus.UNAUTHORIZED);
    }
  }

  private async logApiCall(userId: string | null, action: string, metadata: any) {
    const log = this.auditLogRepository.create({
      user: userId ? { id: userId } as any : null,
      action: `GSMA_GATEWAY_${action}`,
      metadata,
    });
    await this.auditLogRepository.save(log);
  }

  private logError(message: string, error: any) {
    this.logger.error(message, error.response?.data || error.message);
  }

  async verifyNumber(phoneNumber: string, userId: string | null = null) {
    const token = await this.getAccessToken();
    try {
      const response = await this.axiosClient.post(
        '/number-verification/v0/verify',
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await this.logApiCall(userId, 'NUMBER_VERIFY', { phoneNumber, response: response.data });
      return response.data;
    } catch (error) {
      this.logError('Number Verification Failed', error);
      throw new HttpException(error.response?.data?.message || 'Verification Error', error.response?.status || 500);
    }
  }

  async checkSimSwap(phoneNumber: string, userId: string | null = null) {
    const token = await this.getAccessToken();
    try {
      const response = await this.axiosClient.post(
        '/sim-swap/v0/check',
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await this.logApiCall(userId, 'SIM_SWAP_CHECK', { phoneNumber, response: response.data });
      return response.data;
    } catch (error) {
      this.logError('SIM Swap Check Failed', error);
      throw new HttpException(error.response?.data?.message || 'SIM Swap Error', error.response?.status || 500);
    }
  }

  async verifyLocation(req: LocationVerificationRequest, userId: string | null = null) {
    const token = await this.getAccessToken();
    try {
      const response = await this.axiosClient.post(
        '/device-location/v0/verify',
        req,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await this.logApiCall(userId, 'LOCATION_VERIFY', { ...req, response: response.data });
      return response.data;
    } catch (error) {
      this.logError('Location Verification Failed', error);
      throw new HttpException(error.response?.data?.message || 'Location Error', error.response?.status || 500);
    }
  }

  async createQosSession(req: QosSessionRequest, userId: string | null = null) {
    const token = await this.getAccessToken();
    try {
      const response = await this.axiosClient.post(
        '/qos/v0/sessions',
        req,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await this.logApiCall(userId, 'QOS_SESSION_CREATE', { ...req, response: response.data });
      return response.data;
    } catch (error) {
      this.logError('QoS Session Creation Failed', error);
      throw new HttpException(error.response?.data?.message || 'QoS Error', error.response?.status || 500);
    }
  }
}
