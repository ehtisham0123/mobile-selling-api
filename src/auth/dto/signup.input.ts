import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // Optional, for Swagger documentation
import { Role } from "@prisma/client"; // Adjust the import path according to your project structure

export class SignupInput {
  @ApiProperty()
  @IsNotEmpty({ message: "First Name is required" })
  @IsString({ message: "First Name should only contain letters" })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Last Name is required" })
  @IsString({ message: "Last Name should only contain letters" })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid Email address" })
  email: string;

  @ApiProperty({ example: "password" })
  @IsNotEmpty({ message: "Password should not be empty" })
  @MinLength(8, { message: "Password should be at least 8 characters long" })
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role, { message: "Role must be USER or CUSTOMER" })
  role: Role; // ✅ lowercase
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  Role?: Role;
}
