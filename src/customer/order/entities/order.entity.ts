import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../../user/product/entities/product.entity';
import { Table } from '../../../user/table/entities/table.entity';

enum Label {
    Home = 'Home',
    Office = 'Office'
}

export class ProductItem {
    @ApiProperty({ example: '8fbc7104-9f87-4aaa-a580-9cd635e63b5c' })
    id: string;

    @ApiProperty({ description: 'Product ID', example: '8fbc7104-9f87-4aaa-a580-9cd635e63b5c' })
    productId: string;

    @ApiProperty({
        type: Product,
        description: 'Product of the order',
    })
    product: Product;


    @ApiProperty({ example: 2, description: 'Quantity of the item' })
    quantity: number;

    @ApiProperty({ example: 100, description: 'Price of the item' })
    price: number;
}


export class OrderAddress {
    @ApiProperty({ description: 'Full Name', example: 'John Doe' })
    fullName: string;
  
    @ApiProperty({ description: 'Mobile Number', example: '1234567890' })
    mobileNumber: string;
  
    @ApiProperty({ description: 'Province', example: 'test@gmail.com' })
    email: string;
  
    @ApiProperty({ description: 'City', example: 'Toronto' })
    city: string;
  
    @ApiProperty({ description: 'Area', example: 'Downtown' })
    area: string;
  
    @ApiProperty({ description: 'Address', example: '123 Main St' })
    address: string;
  
    @ApiProperty({ description: 'Landmark', example: 'Near Central Park' })
    landmark?: string;
  
    @ApiProperty({ description: 'Label', example: 'Home' }) // Assuming label is a string
    label?: Label;
  }

export class Order {
    @ApiProperty({ example: '311f2ae6-7878-4f20-8833-dcf577eb24d8', description: 'The unique identifier of the order' })
    id: string;

    @ApiProperty({ example: 'cksap55v40000mssb41hik5dz', description: 'ID of the table to which the order belongs' })
    tableId: string;

    @ApiProperty({
        type: Table,
        description: 'Table of the order',
    })
    table: Table;

    @ApiProperty({
        type: [OrderAddress],
        description: 'List of items in the order',
    })
    orderAddress: OrderAddress;

    @ApiProperty({
        type: [ProductItem],
        description: 'List of items in the order',
    })
    items: ProductItem[];
}
