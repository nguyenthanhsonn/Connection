import { Expose, Type } from 'class-transformer';

class PartnerDto {
    @Expose()
    id: number;

    @Expose()
    userName: string;

    @Expose()
    avatarUrl: string;
}

class LastMessageDto {
    @Expose()
    content: string;

    @Expose()
    createdAt: Date;
}

export class LastChatResponseDto {
    @Expose()
    roomId: number;

    @Expose()
    roomName: string;

    @Expose()
    @Type(() => PartnerDto)
    partner: PartnerDto | null;

    @Expose()
    @Type(() => LastMessageDto)
    lastMessage: LastMessageDto | null;
}
