import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordInput {
    @ApiProperty({
        description: 'Email address of the user to send the password reset code',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
