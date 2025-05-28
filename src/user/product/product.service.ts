import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const { recommendations, ...productData } = createProductDto;

    if (recommendations && recommendations.length) {
      return this.prisma.$transaction(async (prisma) => {
        const product = await prisma.product.create({
          data: productData,
        });

        await Promise.all(
          recommendations.map((recommendedProductId) =>
            prisma.productRecommendation.create({
              data: {
                originProductId: product.id,
                recommendedProductId,
              },
            }),
          ),
        );

        return product;
      });
    } else {
      return this.prisma.product.create({
        data: productData,
      });
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        recommendations: {
          include: {
            recommendedProduct: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        recommendations: {
          include: {
            recommendedProduct: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product Item #${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { recommendations, ...updateData } = updateProductDto;

    return this.prisma.$transaction(async (prisma) => {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
      }).catch((error) => {
        throw new NotFoundException(`Product #${id} not found`);
      });

      if (recommendations) {
        await prisma.productRecommendation.deleteMany({
          where: { originProductId: id },
        });

        await Promise.all(
          recommendations.map((recommendedProductId) =>
            prisma.productRecommendation.create({
              data: {
                originProductId: id,
                recommendedProductId,
              },
            }),
          ),
        );
      }

      return updatedProduct;
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  }
}



