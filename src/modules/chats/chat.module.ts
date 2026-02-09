import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Users } from 'src/entities/users.entity';
import { Roles } from 'src/entities/role.entity';
import { Follows } from 'src/entities/follow.entity';
import { Post } from 'src/entities/post.entity';
import { PostSave } from 'src/entities/post-saves.entity';
import { Room } from 'src/entities/room.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Users, Roles, Follows, Post, PostSave, Room])
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway, JwtService, UsersService],
    exports: [ChatService]
})
export class ChatModule { }
