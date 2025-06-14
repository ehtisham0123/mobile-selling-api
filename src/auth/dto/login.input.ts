import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginInput {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}


export class AdminLoginAsUserInput {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
