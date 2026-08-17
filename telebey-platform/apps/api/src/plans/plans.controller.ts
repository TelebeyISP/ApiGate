import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { BuyPlanDto } from './dto/plans.dto';
import { AtGuard } from '../auth/guards';

@ApiTags('Data Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all available data bundles/plans' })
  @ApiResponse({ status: 200, description: 'Return all available plans' })
  findAll() {
    return this.plansService.findAll();
  }

  @Post('buy')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign/Buy a plan for a specific SIM' })
  @ApiResponse({ status: 200, description: 'Plan successfully assigned to SIM' })
  buyPlan(@Body() dto: BuyPlanDto, @Req() req: any) {
    const userId = req.user['sub'] as string;
    return this.plansService.buyPlan(dto, userId);
  }
}
