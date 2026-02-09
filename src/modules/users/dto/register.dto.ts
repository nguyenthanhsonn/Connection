import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ReigsterDto{
    @ApiProperty({description: 'Email người dùng'})
    @IsNotEmpty()
    @IsEmail() 
    email: string 
    
    @ApiProperty({description: 'Password >= 3 ký tự'})
    @IsNotEmpty()
    @MinLength(3)
    password: string
}