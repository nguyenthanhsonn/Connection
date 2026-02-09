import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreateRoomDto } from "./dto/createRoom.dto";
import { RoomService } from "./room.service";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import { GetChatDto } from "src/modules/chats/dto/get-chat.dto";
import { ChatService } from "src/modules/chats/chat.service";

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly chatService: ChatService
    ) { }

    @Post()
    async createRoom(@Req() req, @Body() room: CreateRoomDto) {
        return this.roomService.created(req.user.id, room);
    }

    @Get()
    async getRoom(@Req() req) {
        return this.roomService.getByRequest(req.user.id);
    }

    @Get(':id/chats')
    async getChats(@Param('id', ParseIntPipe) id: number, @Query() dto: GetChatDto) {
        return this.chatService.findAll(id, dto);
    }
}