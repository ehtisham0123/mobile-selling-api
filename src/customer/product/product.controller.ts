import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Customer Product')
@Controller('customer/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
 
  @ApiOkResponse({
    isArray: true,
    type: Product,
    description: 'Get all products',
  })
  @Get('')
  findAll() {
    return this.productService.findAll();
  }
}











