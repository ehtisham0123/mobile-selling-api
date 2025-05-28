import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../prisma/prisma.service';
// import { PusherService } from '../../pusher/pusher.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    // private readonly pusherService: PusherService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderData = {
      ...(createOrderDto.tableId && {
        table: { connect: { id: createOrderDto.tableId } },
      }),
      ...(createOrderDto.orderAddress && {
        orderAddress: {
          create: {
            fullName: createOrderDto.orderAddress.fullName,
            mobileNumber: createOrderDto.orderAddress.mobileNumber,
            email: createOrderDto.orderAddress.email,
            city: createOrderDto.orderAddress.city,
            area: createOrderDto.orderAddress.area,
            address: createOrderDto.orderAddress.address,
            label: createOrderDto.orderAddress.label,
          },
        },
      }),
      items: {
        createMany: {
          data: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    };

    const order = await this.prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        ...(createOrderDto.orderAddress ? { orderAddress: true } : {}),
        ...(createOrderDto.tableId ? { table: true } : {}),
      },
    });

    return order;
  }
}
