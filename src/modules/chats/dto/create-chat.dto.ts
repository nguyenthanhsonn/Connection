import { IsNotEmpty } from "class-validator";

export class ChatDto {
    @IsNotEmpty()
    roomId: number;

    @IsNotEmpty()
    message: string;
}
