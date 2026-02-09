import { ConfigService } from "@nestjs/config";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/entities/chat.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ChatDto } from "./dto/create-chat.dto";
import { UsersService } from "../users/users.service";

// Khởi tạo namespace
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chats' })

// Khai báo các hàm của interface
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server; //Khởi tạo server socket io
    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        private readonly userService: UsersService
    ) { }

    // Thêm lớp xác thực token
    afterInit(server: Server) {
        console.log('Chat Gateway Initialized');

        this.server.use(async (socket: Socket, next) => {
            try {
                // Kiểm tra token ở cả auth (client) và headers (Postman)
                const token = (socket.handshake.auth?.token || socket.handshake.headers['token'])?.trim();

                if (!token || typeof token !== 'string') {
                    console.log('Missing token');
                    return next(new Error('Unauthorized'));
                }
                // Xác thực token
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get<string>('JWT_SECRET')
                });
                const user = await this.userService.getUserById(payload.id);
                if (!user) {
                    console.log(`User not found`);
                    return next(new Error('Unauthorized'))
                }
                // Gán thông tin user vào socket
                socket.data.user = {
                    id: user.id,
                    username: user.username
                }
                next();
            } catch (error) {
                console.error('Socket authentication error', error.message);
                return next(new Error('Unauthorized'));
            }
        });
    }

    //Xử lý connect
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        // Tự động gia nhập room cá nhân của user để nhận thông báo nếu cần
        if (client.data.user) {
            client.join(`user_${client.data.user.id}`);
        }
    }

    // Xử lý disconnect
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // arch-use-rooms: Sử dụng socket rooms để đóng gói tin nhắn, tránh broadcast lãng phí băng thông.
    @SubscribeMessage('join-room')
    handleJoinRoom(
        @MessageBody() data: { roomId: number },
        @ConnectedSocket() client: Socket
    ) {
        const room = `room_${data.roomId}`;
        client.join(room);
        console.log(`Client ${client.id} joined ${room}`);
        return { event: 'joined', room };
    }

    // Xử lý send message
    @SubscribeMessage('send-message')
    async handleSendMessage(
        @MessageBody() data: ChatDto,
        @ConnectedSocket() client: Socket
    ) {
        const senderId = client.data.user.id;
        const chat = await this.chatService.createMessage(senderId, data);

        console.log(`Client ${client.id} sent message ${chat.id} to room_${data.roomId}`);
        // Chỉ gửi cho những người trong phòng chat đó
        this.server.to(`room_${data.roomId}`).emit('new-message', chat);
    }

    // Xử lý delete message
    @SubscribeMessage('delete-message')
    async handleDeleteMessage(
        @MessageBody() data: { messageId: number, roomId: number },
        @ConnectedSocket() client: Socket
    ) {
        if (!data || !data.messageId) return;
        console.log(`Client ${client.id} deleted message ${data.messageId}`);
        await this.chatService.deleteMessage(data.messageId);
        // Chỉ broadcast việc xóa tin nhắn trong phòng đó
        this.server.to(`room_${data.roomId}`).emit('delete-message', data.messageId);
    }
}