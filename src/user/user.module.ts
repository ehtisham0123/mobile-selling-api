import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { stockModule } from './stock/stock.module';
import { TableModule } from './table/table.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    EmployeeModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    stockModule,
    TableModule,
    DashboardModule
  ],
})
export class UserModule {}