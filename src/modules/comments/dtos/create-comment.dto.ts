import { IsString, MinLength } from "class-validator";

export class CreateComment{
    @IsString()
    @MinLength(1, {message: 'Không để trống content'})
    content: string;
}