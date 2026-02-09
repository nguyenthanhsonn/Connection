import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notificaiton } from 'src/entities/notificcation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificaiton])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
