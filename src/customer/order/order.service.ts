import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
// import { PusherService } from '../../pusher/pusher.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService
    // private readonly pusherService: PusherService,
  ) {}

  async create(createOrderDto: CreateOrderDto, buyerId: string) {
    // Step 1: Group items by sellerId
    const groupedBySeller = new Map<string, CreateOrderDto["items"]>();

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { userId: true }, // sellerId
      });

      if (!product)
        throw new Error(`Product with ID ${item.productId} not found`);

      const sellerId = product.userId;
      if (!groupedBySeller.has(sellerId)) {
        groupedBySeller.set(sellerId, []);
      }
      groupedBySeller.get(sellerId)!.push(item);
    }

    const createdOrders = [];

    // Step 2: Create orders per seller
    for (const [sellerId, items] of groupedBySeller.entries()) {
      const order = await this.prisma.order.create({
        data: {
          buyer: { connect: { id: buyerId } },
          seller: { connect: { id: sellerId } },
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
              data: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        },
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

      createdOrders.push(order);
    }

    return createdOrders;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: {
        buyerId: userId, // only orders where this user is the seller
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        orderAddress: true, // include it directly at the order level
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
