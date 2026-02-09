import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { RoomType } from "src/enum/room.enum";

export class CreateRoomDto {

    // Tên phòng chat, bắt buộc khi type không phải là PERSONAL
    @IsNotEmpty()
    @ValidateIf(o => o.type != 'PERSONAL')
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    members: number[];

    // Loại phòng chat
    @IsNotEmpty()
    @IsEnum(RoomType)
    @ValidateIf(o => o.type)
    type: RoomType;
}