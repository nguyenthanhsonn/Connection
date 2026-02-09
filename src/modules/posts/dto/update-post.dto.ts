import { IsOptional, IsString } from "class-validator";


export class UpdatePost{
    @IsOptional()
    @IsString()
    caption?: string

    @IsOptional()
    @IsString({each: true})
    imageUrls?: string[]
}