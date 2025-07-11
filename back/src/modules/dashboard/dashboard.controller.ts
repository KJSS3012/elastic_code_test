import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Farmer } from 'src/shared/decorators/farmer.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Admin stats returned successfully' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @Get('admin-stats')
  async getAdminStats(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getAdminStats(query);
  }

  @ApiOperation({ summary: 'Get farmer dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Farmer stats returned successfully' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @Get('farmer-stats')
  async getFarmerStats(@Farmer('id') farmerId: string, @Query() query: DashboardQueryDto) {
    return this.dashboardService.getFarmerStats(farmerId, query);
  }
}
