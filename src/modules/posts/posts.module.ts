import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/dto/user.dto';
import { Users } from 'src/entities/users.entity';
import { Post } from 'src/entities/post.entity';
import { Post_Images } from 'src/entities/post-images.entity';
import { Post_Like } from 'src/entities/post-like.entity';
import { Comments } from 'src/entities/comments.entity';
import { CommentsService } from '../comments/comments.service';
import { PostSave } from 'src/entities/post-saves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Post, Post_Images, Post_Like, Comments, PostSave, Post_Like])],
  controllers: [PostsController],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}
