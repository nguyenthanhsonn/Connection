import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificaiton } from 'src/entities/notificcation.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notificaiton) private readonly notiRepo: Repository<Notificaiton>
    ){}

    async createNoti(){}
}
