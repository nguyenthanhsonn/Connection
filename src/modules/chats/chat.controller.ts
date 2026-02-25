import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "src/guards/jwt.guard";

@Controller('chats')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async getChatList(@Req() req) {
        return this.chatService.getChatList(req.user.id);
    }
}
