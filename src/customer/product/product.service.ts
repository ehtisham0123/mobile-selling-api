import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Sql } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  // async findAll(id: string) {
  //   return await this.prisma.product.findMany({
  //     include: {
  //       recommendations: {
  //         include: {
  //           recommendedProduct: true,
  //         },
  //       },
  //     },
  //   });
  // }
  async findAll() {
    const result = await this.prisma.$queryRaw`
    SELECT
      m.id,
      m.name,
      m.price,
      m.isAvailable,
      m.image,
      m.categoryId,
      c.name AS categoryName,
      GROUP_CONCAT(r.recommendedProductId) AS recommendations
    FROM
      Product m
    LEFT JOIN
      ProductRecommendation r
      ON m.id = r.originProductId
    LEFT JOIN
      Category c
      ON m.categoryId = c.id
    GROUP BY
      m.id, m.name, m.price, m.isAvailable, m.image, m.categoryId, c.name;
  `;
    return result;
  }
}
