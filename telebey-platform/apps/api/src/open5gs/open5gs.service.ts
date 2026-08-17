import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection, Model, Schema } from 'mongoose';
import { randomBytes } from 'crypto';
import axios from 'axios';

export interface Open5gsSliceSession {
  name: string;
  type: number;
  qos?: {
    index: number;
    arp: {
      priority_level: number;
      pre_emption_capability: number;
      pre_emption_vulnerability: number;
    };
  };
  ambr?: {
    downlink: { value: number; unit: number };
    uplink: { value: number; unit: number };
  };
  pcc_rule?: unknown[];
}

export interface Open5gsSubscriberDoc {
  imsi: string;
  msisdn?: string[];
  schema_version?: number;
  subscribed_rau_tau_timer?: number;
  network_access_mode?: number;
  subscriber_status?: number;
  access_restriction_data?: number;
  operator_determined_barring?: number;
  security?: {
    k?: string;
    amf?: string;
    op?: string | null;
    opc?: string;
  };
  ambr?: {
    downlink: { value: number; unit: number };
    uplink: { value: number; unit: number };
  };
  slice?: Array<{
    sst: number;
    default_indicator?: boolean;
    session?: Open5gsSliceSession[];
  }>;
}

export interface RegisterSubscriberInput {
  imsi: string;
  ki?: string;
  opc?: string;
  apn?: string;
  msisdn?: string;
}

@Injectable()
export class Open5gsSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Open5gsSubscriberService.name);
  private connection: Connection | null = null;
  private subscriberModel: Model<Open5gsSubscriberDoc> | null = null;
  private lastError: string | null = null;
  private connectedAt: Date | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Do not block API boot if Open5GS MongoDB is still starting.
    this.connectWithRetry().catch((error: Error) => {
      this.logger.error(`Open5GS MongoDB background connect failed: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      this.subscriberModel = null;
    }
  }

  isConnected(): boolean {
    return this.connection?.readyState === 1 && !!this.subscriberModel;
  }

  getMongoUri(): string {
    return this.configService.get<string>(
      'OPEN5GS_MONGODB_URI',
      'mongodb://localhost:27017/open5gs',
    );
  }

  getWebuiUrl(): string {
    return this.configService.get<string>(
      'OPEN5GS_WEBUI_URL',
      'http://localhost:9999',
    );
  }

  async getStatus() {
    const webui = await this.probeWebui();
    let subscriberCount: number | null = null;
    if (this.ensureModel(false)) {
      try {
        subscriberCount = await this.subscriberModel!.countDocuments();
      } catch (error) {
        this.lastError = error instanceof Error ? error.message : String(error);
      }
    }

    return {
      mongodb: {
        connected: this.isConnected(),
        uri: this.redactUri(this.getMongoUri()),
        database: 'open5gs',
        collection: 'subscribers',
        connectedAt: this.connectedAt,
        lastError: this.lastError,
        subscriberCount,
      },
      webui: {
        url: this.getWebuiUrl(),
        ...webui,
      },
      core: 'open5gs',
      source: 'https://github.com/TelebeyISP/isp.router-dashboard',
    };
  }

  async listSubscribers(limit = 50): Promise<Open5gsSubscriberDoc[]> {
    this.ensureModel();
    return this.subscriberModel!
      .find()
      .select('-security.k -security.opc -security.op -security.rand')
      .sort({ imsi: 1 })
      .limit(Math.min(Math.max(limit, 1), 200))
      .lean();
  }

  async getSubscriber(imsi: string) {
    this.ensureModel();
    return this.subscriberModel!
      .findOne({ imsi })
      .select('-security.k -security.opc -security.op -security.rand')
      .lean();
  }

  async registerSubscriber(input: RegisterSubscriberInput) {
    this.ensureModel();
    const { imsi, apn = 'internet', msisdn } = input;
    const ki = (input.ki || randomBytes(16).toString('hex')).toUpperCase();
    const opc = (input.opc || randomBytes(16).toString('hex')).toUpperCase();

    const existing = await this.subscriberModel!.findOne({ imsi });
    if (existing) {
      this.logger.warn(`Subscriber with IMSI ${imsi} already exists in Open5GS`);
      return existing.toObject();
    }

    const subscriber = new this.subscriberModel!({
      schema_version: 1,
      imsi,
      msisdn: msisdn ? [msisdn] : [],
      subscribed_rau_tau_timer: 12,
      network_access_mode: 0,
      subscriber_status: 0,
      access_restriction_data: 32,
      operator_determined_barring: 0,
      security: {
        k: ki,
        amf: '8000',
        op: null,
        opc,
      },
      ambr: {
        downlink: { value: 1, unit: 3 },
        uplink: { value: 1, unit: 3 },
      },
      slice: [
        {
          sst: 1,
          default_indicator: true,
          session: [
            {
              name: apn,
              type: 3,
              qos: {
                index: 9,
                arp: {
                  priority_level: 8,
                  pre_emption_capability: 1,
                  pre_emption_vulnerability: 1,
                },
              },
              ambr: {
                downlink: { value: 1, unit: 3 },
                uplink: { value: 1, unit: 3 },
              },
              pcc_rule: [],
            },
          ],
        },
      ],
    });

    const saved = await subscriber.save();
    this.logger.log(`Registered subscriber ${imsi} in Open5GS`);
    return saved.toObject();
  }

  async deleteSubscriber(imsi: string) {
    this.ensureModel();
    const result = await this.subscriberModel!.deleteOne({ imsi });
    if (result.deletedCount === 0) {
      this.logger.warn(`Subscriber with IMSI ${imsi} not found for deletion`);
    } else {
      this.logger.log(`Deleted subscriber ${imsi} from Open5GS`);
    }
    return result;
  }

  async updateSubscriberStatus(imsi: string, status: number) {
    this.ensureModel();
    const result = await this.subscriberModel!.updateOne(
      { imsi },
      { $set: { subscriber_status: status } },
    );
    this.logger.log(`Updated subscriber ${imsi} status to ${status}`);
    return result;
  }

  private async probeWebui(): Promise<{ reachable: boolean; statusCode?: number; error?: string }> {
    try {
      const response = await axios.get(this.getWebuiUrl(), {
        timeout: 2500,
        validateStatus: () => true,
      });
      return { reachable: response.status < 500, statusCode: response.status };
    } catch (error) {
      return {
        reachable: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private ensureModel(throwIfMissing = true): boolean {
    if (this.isConnected()) return true;
    if (throwIfMissing) {
      throw new ServiceUnavailableException(
        'Open5GS MongoDB is not connected. Start isp.router-dashboard / MongoDB and retry.',
      );
    }
    return false;
  }

  private redactUri(uri: string): string {
    return uri.replace(/\/\/([^:/@]+):([^@]+)@/, '//***:***@');
  }

  private async connectWithRetry(retries = 12): Promise<void> {
    const mongoUri = this.getMongoUri();

    while (retries > 0) {
      try {
        this.connection = await mongoose.createConnection(mongoUri, {
          serverSelectionTimeoutMS: 4000,
        }).asPromise();

        const SubscriberSchema = new Schema(
          {
            schema_version: { $type: Number, default: 1 },
            imsi: { $type: String, unique: true, required: true },
            msisdn: [String],
            imeisv: [String],
            security: {
              k: String,
              op: String,
              opc: String,
              amf: String,
              rand: String,
            },
            ambr: {
              downlink: { value: Number, unit: Number },
              uplink: { value: Number, unit: Number },
            },
            slice: [
              {
                sst: { $type: Number, required: true },
                sd: String,
                default_indicator: Boolean,
                session: [
                  {
                    name: { $type: String, required: true },
                    type: Number,
                    qos: {
                      index: Number,
                      arp: {
                        priority_level: Number,
                        pre_emption_capability: Number,
                        pre_emption_vulnerability: Number,
                      },
                    },
                    ambr: {
                      downlink: { value: Number, unit: Number },
                      uplink: { value: Number, unit: Number },
                    },
                    pcc_rule: [Schema.Types.Mixed],
                  },
                ],
              },
            ],
            access_restriction_data: { $type: Number, default: 32 },
            subscriber_status: { $type: Number, default: 0 },
            operator_determined_barring: { $type: Number, default: 0 },
            network_access_mode: { $type: Number, default: 0 },
            subscribed_rau_tau_timer: { $type: Number, default: 12 },
          },
          { collection: 'subscribers', typeKey: '$type' },
        );

        this.subscriberModel = this.connection.model<Open5gsSubscriberDoc>(
          'Subscriber',
          SubscriberSchema,
        );
        this.connectedAt = new Date();
        this.lastError = null;
        this.logger.log(`Connected to Open5GS MongoDB at ${this.redactUri(mongoUri)}`);
        return;
      } catch (error) {
        this.lastError = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Open5GS MongoDB connect failed (${retries - 1} retries left): ${this.lastError}`,
        );
        retries -= 1;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
