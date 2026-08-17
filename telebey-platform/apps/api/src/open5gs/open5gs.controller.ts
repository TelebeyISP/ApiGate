import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Open5gsSubscriberService } from './open5gs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Open5GS Network')
@Controller('open5gs')
export class Open5gsController {
  constructor(private readonly open5gs: Open5gsSubscriberService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Open5GS / isp.router-dashboard connectivity status',
    description:
      'Reports MongoDB subscriber-store health, WebUI reachability, and subscriber count.',
  })
  getStatus() {
    return this.open5gs.getStatus();
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List subscribers provisioned in the Open5GS core' })
  listSubscribers(@Query('limit') limit?: string) {
    const parsed = Number(limit);
    return this.open5gs.listSubscribers(Number.isFinite(parsed) ? parsed : 50);
  }

  @Get('subscribers/:imsi')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch one Open5GS subscriber by IMSI' })
  getSubscriber(@Param('imsi') imsi: string) {
    return this.open5gs.getSubscriber(imsi);
  }
}
