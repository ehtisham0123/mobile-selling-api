import { ApiProperty } from "@nestjs/swagger";

export class Product {
    @ApiProperty({ example: 'cksap55v40000mssb41hik5dz', description: 'Unique identifier for the product item' })
    id: string;

    @ApiProperty({ example: 'Burger', description: 'Name of the product item' })
    name: string;

    @ApiProperty({ example: '10.99', description: 'Price of the product item' })
    price: string;

    @ApiProperty({ example: 'true', description: 'Availability status of the product item' })
    isAvailable: string;
     
    @ApiProperty({ example: 'burger.jpg', description: 'URL of the image for the product item (optional)' })
    image: string;

    @ApiProperty({ example: '445ab4c43545345sd4123', description: 'ID of the category to which the product item belongs' })
    categoryId: string;

    @ApiProperty({ example: '2024-03-20T12:00:00.000Z', description: 'Date and time when the product item record was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-03-20T14:30:00.000Z', description: 'Date and time when the product item record was last updated' })
    updatedAt: Date;
}
