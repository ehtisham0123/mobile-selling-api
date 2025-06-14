import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  NotFoundException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import * as sharp from "sharp";
import * as fs from "fs/promises";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Product } from "./entities/product.entity";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags("User Product")
@UseGuards(JwtAuthGuard)
@Controller("user/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    type: Product,
    description: "Create a new product",
  })
  @Post("")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, "./public/images");
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split(".").pop();
          const filename = `${uniqueSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
    })
  )
  async addProductItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Req() req: any
  ) {
    const thumbnailFilename = `${file.filename}`;
    await sharp(file.path)
      .resize(100, 100) // Adjust dimensions as needed
      .toFile(join("./public/images/sharp", thumbnailFilename));

    const productItem = {
      ...createProductDto,
      image: file.filename,
    };

    const userId = req.user.id;
    // Save product item
    const savedProductItem = await this.productService.create(
      productItem,
      userId
    );
    return { savedProductItem };
  }

  @ApiOkResponse({
    isArray: true,
    type: Product,
    description: "Get all products",
  })
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.productService.findAll(userId);
  }

  @ApiOkResponse({
    type: Product,
    description: "Get product by given id",
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @ApiOkResponse({
    type: Product,
    description: "Update the product by given id",
  })
  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, "./public/images");
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split(".").pop();
          const filename = `${uniqueSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
    })
  )
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      const thumbnailFilename = `${file.filename}`;
      await sharp(file.path)
        .resize(100, 100) // Adjust dimensions as needed
        .toFile(join("./public/images/sharp", thumbnailFilename));

      const productItem = {
        ...updateProductDto,
        image: file.filename,
      };
      // Save product item
      const savedProductItem = await this.productService.update(
        id,
        productItem
      );
      return { savedProductItem };
    } else {
      const productItem = {
        ...updateProductDto,
      };
      // Save product item
      const savedProductItem = await this.productService.update(
        id,
        productItem
      );
      return { savedProductItem };
    }
  }

  @ApiOkResponse({
    type: Product,
    description: "Delete the product by given id",
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (product.image) {
      try {
        let path = `./public/images/${product.image}`;
        await fs.unlink(path);

        // Construct the path to the thumbnail image using a different filename
        const thumbnailFilename = `./public/images/sharp/${product.image}`;
        await fs.unlink(thumbnailFilename);
      } catch (error) {
        console.error(`Error deleting image ${product.image}:`, error);
      }
    }
    // Remove the product item
    return this.productService.remove(id);
  }
}
