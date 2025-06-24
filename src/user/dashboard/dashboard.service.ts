import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string): Promise<any> {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          sellerId: userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const dashboardDataMap = new Map<
        string,
        { name: string; image: string; sold: number }
      >();

      const monthlyOrders = Array(12).fill(0);
      let totalRevenue = 0;
      let totalProductsSold = 0;

      for (const order of orders) {
        const month = new Date(order.createdAt).getMonth(); // 0–11
        monthlyOrders[month]++;

        for (const item of order.items) {
          const { name, image } = item.product;
          const sold = item.quantity;
          const revenue = item.price * item.quantity;

          totalRevenue += revenue;
          totalProductsSold += sold;

          const existingData = dashboardDataMap.get(name);
          if (existingData) {
            existingData.sold += sold;
          } else {
            dashboardDataMap.set(name, { name, image, sold });
          }
        }
      }

      const dashboardDataArray = Array.from(dashboardDataMap.values());
      dashboardDataArray.sort((a, b) => b.sold - a.sold);

      return {
        totalOrders: orders.length,
        totalRevenue,
        totalProductsSold,
        topProducts: dashboardDataArray.slice(0, 5),
        monthlyOrders,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }



async getAdminDashboard(): Promise<any> {
  try {
    const orders = await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalUsers = await this.prisma.user.count({
      where: { role: { not: 'ADMIN' } },
    });

    const totalProducts = await this.prisma.product.count();
    const totalOrders = orders.length;

    const monthlyOrders = Array(12).fill(0);
    let totalRevenue = 0;

    const productSalesMap = new Map<
      string,
      { name: string; image: string; sold: number }
    >();

    for (const order of orders) {
      const month = new Date(order.createdAt).getMonth();
      monthlyOrders[month]++;

      for (const item of order.items) {
        const { name, image } = item.product;
        const sold = item.quantity;
        const revenue = item.price * item.quantity;

        totalRevenue += revenue;

        if (productSalesMap.has(name)) {
          productSalesMap.get(name)!.sold += sold;
        } else {
          productSalesMap.set(name, { name, image, sold });
        }
      }
    }

    const topProducts = Array.from(productSalesMap.values()).sort((a, b) => b.sold - a.sold).slice(0, 5);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      monthlyOrders,
      topProducts,
    };
  } catch (error) {
    throw new Error(`Admin Dashboard fetch failed: ${error.message}`);
  }
}


}
