import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('user/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('')
  async getDashboardData(): Promise<any[]> {
    const dashboardData = await this.dashboardService.getDashboardData();
    return dashboardData;
  }
}
