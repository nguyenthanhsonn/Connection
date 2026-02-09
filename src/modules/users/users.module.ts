import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Roles } from 'src/entities/role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JwtStrategy } from 'src/guards/jwt.stragety';
import { Follows } from 'src/entities/follow.entity';
import { Post } from 'src/entities/post.entity';
import { PostSave } from 'src/entities/post-saves.entity';
import { Chat } from 'src/entities/chat.entity';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, Follows, Post, PostSave, Chat, Room]),
    PassportModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, JwtService],
  exports: [UsersService]
})
export class UsersModule { }
