import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("user/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  async getDashboardData(@Req() req: any): Promise<any[]> {
    const userId = req.user.id;
    const dashboardData = await this.dashboardService.getDashboardData(userId);
    return dashboardData;
  }

  @Get("admin")
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}
