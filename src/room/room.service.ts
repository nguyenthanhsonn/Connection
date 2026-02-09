import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomDto } from "./dto/createRoom.dto";
import { Repository } from "typeorm";
import { Room } from "src/entities/room.entity";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) { }

    async created(userId: number, roomDto: CreateRoomDto) {
        const memberIds = Array.from(new Set([...roomDto.members, userId]));
        const newRoom = this.roomRepository.create({
            ...roomDto,
            members: memberIds.map(id => ({ id }))
        });
        const savedRoom = await this.roomRepository.save(newRoom);
        // Load lại để lấy thông tin hiển thị
        const fullRoom = await this.roomRepository.findOne({
            where: { id: savedRoom.id },
            relations: ['members']
        });
        if (!fullRoom) throw new NotFoundException('Không tạo được phòng');
        // Logic tên như bạn muốn: Group -> name, Personal -> tên User B
        let displayName = fullRoom.name;
        if (fullRoom.type === 'PERSONAL') {
            const otherUser = fullRoom.members.find(m => m.id !== userId);
            displayName = otherUser ? otherUser.userName : 'Chat';
        }
        return { ...fullRoom, name: displayName };
    }

    // Lấy danh sách phòng chat của user
    async getByRequest(userId: number) {
        return await this.roomRepository.find({
            where: {
                members: { id: userId }
            },
            // join bảng members
            relations: {
                members: true
            }
        })
    }
}