import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentGateway } from './comment.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Post } from 'src/entities/post.entity';
import { Comments } from 'src/entities/comments.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Post, Comments])],
  controllers: [CommentsController],
  providers: [CommentsService, CommentGateway, ConfigService, JwtService],
})
export class CommentsModule {}
