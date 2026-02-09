import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto{
    @ApiProperty({description: 'Email người dùng đã đăng ký'})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({description: 'Password của người dùng'})
    @IsNotEmpty()
    password: string
}