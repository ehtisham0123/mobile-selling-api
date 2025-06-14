import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordInput {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Reset code sent to the user\'s email',
        example: '654321',
    })
    @IsString()
    @IsNotEmpty()
    resetCode: string;

    @ApiProperty({
        description: 'New password for the user account',
        example: 'newStrongPassword123',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}
