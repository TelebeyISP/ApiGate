import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection, Schema } from 'mongoose';

@Injectable()
export class Open5gsSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Open5gsSubscriberService.name);
  private connection: Connection;
  private subscriberModel: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private async connectWithRetry(retries = 5) {
    const mongoUri = this.configService.get<string>('OPEN5GS_MONGODB_URI', 'mongodb://localhost:27017/nextgepc');
    
    while (retries > 0) {
      try {
        this.connection = await mongoose.createConnection(mongoUri).asPromise();
        
        const SubscriberSchema = new Schema({
          imsi: { type: String, required: true, unique: true },
          subscribed_rau_tau_timer: { type: Number, default: 12 },
          network_access_mode: { type: Number, default: 0 },
          subscriber_status: { type: Number, default: 0 },
          access_restriction_data: { type: Number, default: 32 },
          security: {
            k: { type: String, required: true },
            amf: { type: String, default: '8000' },
            op_type: { type: Number, default: 1 },
            opc: { type: String, required: true },
          },
          ambr: {
            downlink: { value: { type: Number, default: 1 }, unit: { type: Number, default: 3 } },
            uplink: { value: { type: Number, default: 1 }, unit: { type: Number, default: 3 } },
          },
          slice: [{
            sst: { type: Number, default: 1 },
            default_indicator: { type: Boolean, default: true },
            session: [{ name: { type: String, default: 'internet' }, type: { type: Number, default: 3 } }]
          }]
        }, { collection: 'subscribers' });

        this.subscriberModel = this.connection.model('Subscriber', SubscriberSchema);
        this.logger.log('Successfully connected to Open5GS MongoDB');
        return;
      } catch (error) {
        this.logger.error(`Failed to connect to Open5GS MongoDB. Retries left: ${retries - 1}`, error.stack);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    throw new Error('Could not establish connection to Open5GS MongoDB after multiple retries.');
  }

  async registerSubscriber(imsi: string, ki: string, opc: string, apn = 'internet') {
    try {
      const existing = await this.subscriberModel.findOne({ imsi });
      if (existing) {
        this.logger.warn(`Subscriber with IMSI ${imsi} already exists in Open5GS`);
        return existing;
      }

      const subscriber = new this.subscriberModel({
        imsi,
        security: { k: ki, opc },
        slice: [{ sst: 1, default_indicator: true, session: [{ name: apn, type: 3 }] }]
      });

      const saved = await subscriber.save();
      this.logger.log(`Registered subscriber ${imsi} in Open5GS`);
      return saved;
    } catch (error) {
      this.logger.error(`Error registering subscriber ${imsi}`, error.stack);
      throw error;
    }
  }

  async deleteSubscriber(imsi: string) {
    try {
      const result = await this.subscriberModel.deleteOne({ imsi });
      if (result.deletedCount === 0) {
        this.logger.warn(`Subscriber with IMSI ${imsi} not found for deletion`);
      } else {
        this.logger.log(`Deleted subscriber ${imsi} from Open5GS`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error deleting subscriber ${imsi}`, error.stack);
      throw error;
    }
  }

  async getSubscriber(imsi: string) {
    try {
      return await this.subscriberModel.findOne({ imsi }).lean();
    } catch (error) {
      this.logger.error(`Error fetching subscriber ${imsi}`, error.stack);
      throw error;
    }
  }

  async updateSubscriberStatus(imsi: string, status: number) {
    try {
      const result = await this.subscriberModel.updateOne(
        { imsi },
        { $set: { subscriber_status: status } }
      );
      this.logger.log(`Updated subscriber ${imsi} status to ${status}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating subscriber ${imsi} status`, error.stack);
      throw error;
    }
  }
}
