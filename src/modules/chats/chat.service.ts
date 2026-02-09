import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/entities/chat.entity";
import { LessThan, Repository } from "typeorm";
import { ChatDto } from "./dto/create-chat.dto";
import { GetChatDto } from "./dto/get-chat.dto";
import { ChatResponseDto } from "./dto/chat-response.dto";
import { Users } from "src/entities/users.entity";
import { Room } from "src/entities/room.entity";

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
     * Hiển thị danh sách các cuộc hội thoại gần nhất của User
     * @param userId ID của người dùng hiện tại
     * @returns Danh sách chứa thông tin người chat cùng và tin nhắn cuối cùng
     */
    async displayListChatLast(userId: number): Promise<any[]> {
        // perf-optimize-database: Sử dụng QueryBuilder để lấy phòng và thành viên một cách tối ưu
        const userRooms = await this.roomRepository
            .createQueryBuilder('room')
            .innerJoin('room.members', 'checkMember', 'checkMember.id = :userId', { userId })
            .leftJoinAndSelect('room.members', 'members')
            .getMany();

        if (!userRooms.length) return [];

        const roomIds = userRooms.map(r => r.id);

        // Thay vì N+1 queries, ta lấy tin nhắn cuối của tất cả phòng trong 1 query duy nhất
        const latestMessages = await this.chatRepository
            .createQueryBuilder('chat')
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

        // Tạo danh sách kết quả
        return userRooms
            .map((room) => {
                const partner = room.members.find(m => m.id !== userId);
                const lastMsg = messageMap.get(room.id);

                return {
                    roomId: room.id,
                    roomName: room.name,
                    partner: partner ? {
                        id: partner.id,
                        username: partner.userName,
                        avatarUrl: partner.avatarUrl
                    } : null,
                    lastMessage: lastMsg ? {
                        content: lastMsg.message,
                        createdAt: lastMsg.createdAt
                    } : null
                };
            })
            .filter(item => item.lastMessage !== null) // Chỉ lấy các phòng đã có hội thoại
            .sort((a, b) => b.lastMessage!.createdAt.getTime() - a.lastMessage!.createdAt.getTime()); // Sắp xếp theo mới nhất
    }
}
