import { IsOptional, IsString, IsArray } from "class-validator"

export class PostDto {
    @IsOptional()
    @IsString()
    caption: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls: string[]
}