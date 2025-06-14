import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationCodeInput {
    @ApiProperty({
        description: 'User email address to resend the verification code',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
