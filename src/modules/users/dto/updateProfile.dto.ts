import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";


export class UpdateProfile{
    @ApiPropertyOptional({description: 'Thay đổi email'})
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiPropertyOptional({description: 'Thay đổi username'})
    @IsOptional()
    @IsString()
    username?: string

    @ApiPropertyOptional({description: 'Cập nhật avatar'})
    @IsOptional()
    @IsString()
    avatarUrl?: string

    @ApiPropertyOptional({description: 'Cập nhật bio_text'})
    @IsOptional()
    @IsString()
    bioText?: string
}