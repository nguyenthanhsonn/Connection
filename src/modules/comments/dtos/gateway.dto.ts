import { IsNumber } from "class-validator";

export class PostRoomDto{
    @IsNumber()
    postId: number;
}