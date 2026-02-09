import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "src/guards/jwt.guard";

@Controller('chats')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async displayChatLast(@Req() req){
        return this.chatService.displayListChatLast(req.user.id);
    }
}
