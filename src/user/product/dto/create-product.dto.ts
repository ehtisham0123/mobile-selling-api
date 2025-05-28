import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    price: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    isAvailable: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: string;
   
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    recommendations?: string[];

    @ApiProperty()
    @IsString() 
    @IsNotEmpty()
    categoryId: string;
}
