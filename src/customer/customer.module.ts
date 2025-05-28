import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    OrderModule
  ],
})
export class CustomerModule {}