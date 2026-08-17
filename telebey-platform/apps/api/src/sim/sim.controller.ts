import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SimService } from './sim.service';
import { ActivateSimDto } from './dto/sim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { SimOwnershipGuard } from '../common/guards/sim-ownership.guard';
import { Throttle } from '@nestjs/throttler';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    [key: string]: any;
  };
}

@ApiTags('SIM Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sim')
export class SimController {
  constructor(private readonly simService: SimService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.simService.findAll(userId);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('activate')
  @HttpCode(HttpStatus.OK)
  activate(@Body() dto: ActivateSimDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.simService.activate(dto, userId);
  }

  @UseGuards(SimOwnershipGuard)
  @Get('usage/:id')
  getUsage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.simService.getUsage(id, userId);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(SimOwnershipGuard)
  @Post('block/:id')
  block(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.simService.block(id, userId);
  }

  @UseGuards(SimOwnershipGuard)
  @Get(':id')
  getSimDetails(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.simService.findOne(id, userId);
  }
}
