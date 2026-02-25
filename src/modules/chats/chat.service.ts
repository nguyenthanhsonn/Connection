import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/entities/chat.entity";
import { LessThan, Repository } from "typeorm";
import { ChatDto } from "./dto/create-chat.dto";
import { GetChatDto } from "./dto/get-chat.dto";
import { ChatResponseDto } from "./dto/chat-response.dto";
import { Users } from "src/entities/users.entity";
import { Room } from "src/entities/room.entity";
import { LastChatResponseDto } from "./dto/last-chat-response.dto";


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        // Inject thêm Room repository để xử lý logic phòng chat
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Users)
        private readonly userRepo: Repository<Users>
    ) { }

    async createMessage(senderId: number, data: ChatDto) {
        // arch-security: Kiểm tra xem user có thực sự ở trong phòng này không trước khi gửi tin nhắn
        const isMember = await this.roomRepository.exists({
            where: { id: data.roomId, members: { id: senderId } }
        });

        if (!isMember) {
            throw new ForbiddenException('Bạn không có quyền gửi tin nhắn vào phòng này');
        }

        const chat = this.chatRepository.create({
            ...data,
            senderId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.chatRepository.save(chat);
    }

    async deleteMessage(id: number) {
        const chat = await this.chatRepository.findOne({ where: { id } });
        if (!chat) throw new NotFoundException('Tin nhắn không tồn tại');
        return this.chatRepository.remove(chat);
    }

    // Lấy danh sách tin nhắn trong phòng chat 
    async findAll(roomId: number, data: GetChatDto): Promise<ChatResponseDto[]> {
        // arch-validation: Kiểm tra phòng tồn tại
        const roomExists = await this.roomRepository.exists({ where: { id: roomId } });
        if (!roomExists) throw new NotFoundException('Phòng chat không tồn tại');

        const where: any = { roomId };

        if (data.last_id) {
            where.id = LessThan(data.last_id);
        }

        const chatsRoom = await this.chatRepository.find({
            where,
            order: {
                createdAt: 'DESC'
            },
            take: data.limit || 10
        });
        return chatsRoom.map(chat => ({
            id: chat.id,
            senderId: chat.senderId,
            roomId: chat.roomId,
            message: chat.message
        }));
    }


    /**
     * Lấy danh sách các cuộc hội thoại của User
     * Bao gồm cả các phòng mới được tạo nhưng chưa có tin nhắn (để hiển thị danh sách người mới follow/chat)
     * Sắp xếp theo tin nhắn mới nhất, nếu chưa có tin nhắn thì xếp theo thời gian tạo phòng
     */
    async getChatList(userId: number): Promise<LastChatResponseDto[]> {
        // perf-optimize-database: Sử dụng QueryBuilder để lấy phòng và thành viên một cách tối ưu
        const userRooms = await this.roomRepository
            .createQueryBuilder('room')
            .innerJoin('room.members', 'checkMember', 'checkMember.id = :userId', { userId })
            .leftJoinAndSelect('room.members', 'members')
            .select([
                'room.id',
                'room.name',
                'room.type',
                'room.createdAt',
                'members.id',
                'members.userName',
                'members.avatarUrl'
            ])
            .getMany();

        if (!userRooms.length) return [];

        const roomIds = userRooms.map(r => r.id);

        // db-avoid-n-plus-one: Lấy tin nhắn cuối của tất cả các phòng trong 1 query
        const latestMessages = await this.chatRepository
            .createQueryBuilder('chat')
            .select([
                'chat.message',
                'chat.createdAt',
                'chat.roomId'
            ])
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(c.id)')
                    .from(Chat, 'c')
                    .where('c.roomId IN (:...roomIds)', { roomIds })
                    .groupBy('c.roomId')
                    .getQuery();
                return 'chat.id IN ' + subQuery;
            })
            .getMany();

        const messageMap = new Map(latestMessages.map(m => [m.roomId, m]));

        // Tạo danh sách kết quả và sắp xếp
        return userRooms
            .map((room) => {
                const partner = room.members.find(m => m.id !== userId);
                const lastMsg = messageMap.get(room.id);

                return {
                    roomId: room.id,
                    roomName: room.name || (room.type === 'PERSONAL' && partner ? partner.userName : 'Unknown Room'),
                    partner: partner ? {
                        id: partner.id,
                        userName: partner.userName,
                        avatarUrl: partner.avatarUrl
                    } : null,
                    lastMessage: lastMsg ? {
                        content: lastMsg.message,
                        createdAt: lastMsg.createdAt
                    } : null,
                    // Trường ảo để phục vụ việc sắp xếp
                    _updatedAt: lastMsg ? lastMsg.createdAt.getTime() : room.createdAt.getTime()
                };
            })
            // Sắp xếp: Ưu tiên tin nhắn mới nhất, sau đó đến phòng mới tạo nhất
            .sort((a, b) => b._updatedAt - a._updatedAt)
            .map(({ _updatedAt, ...rest }) => rest as LastChatResponseDto);
    }
}
