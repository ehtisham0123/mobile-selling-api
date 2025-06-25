import { Controller, Post, Body, Req, UseGuards, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Order } from "./entities/order.entity"; // Assuming you only need the Order entity
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags("Customer Orders")
@UseGuards(JwtAuthGuard)
@Controller("customer/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto, description: "Order to create" })
  @ApiOkResponse({ description: "Order created successfully.", type: [Order] })
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const buyerId = req.user.id;
    return await this.orderService.create(createOrderDto, buyerId);
  }

  @ApiOkResponse({
    isArray: true,
    type: Order,
    description: "Get all orders",
  })
  @Get("all")
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.orderService.findAll(userId);
  }
}
