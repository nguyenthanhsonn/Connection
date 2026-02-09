import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './config/orm.config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guards/role.guard';
import { Follows } from './entities/follow.entity';
import { FollowsModule } from './modules/follows/follows.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './modules/chats/chat.module';
import { RoomModule } from './room/room.module';

// console.log(`>>> orm config: ${JSON.stringify(ormConfig, null, 2)}`);


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      ...ormConfig,
      autoLoadEntities: true
    }),
    UsersModule,
    FollowsModule,
    PostsModule,
    CommentsModule,
    NotificationModule,
    ChatModule,
    RoomModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class AppModule { }
