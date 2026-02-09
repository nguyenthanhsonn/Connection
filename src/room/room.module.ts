import { Room } from "src/entities/room.entity"
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";


import { ChatModule } from "src/modules/chats/chat.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        ChatModule
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService],
})
export class RoomModule { }