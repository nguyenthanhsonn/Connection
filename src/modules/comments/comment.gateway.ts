import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CommentsService } from "./comments.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "src/entities/comments.entity";
import { Repository } from "typeorm";
import { CreateComment } from './dtos/create-comment.dto'
import { PostRoomDto } from "./dtos/gateway.dto";
import { IComment } from "./interface/comment.interface";

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/comments' })

export class CommentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    //Khai báo server socket io
    @WebSocketServer() server: Server;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly commentsService: CommentsService,
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>
    ) { }
    //Middlewar xac thuc token
    afterInit(server: Server) {
        console.log('Comment Gateway Initialized');
        // Them middleware
        this.server.use(async (socket: Socket, next) => {
            const token = socket.handshake.auth?.token;
            if (!token || typeof token !== 'string') {
                console.log('Missing token');
                return next(new Error('Unauthorized'));
            }
            try {
                const decoded = await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get('JWT_SECRET'),
                });
                socket.data.user = decoded;
                next();
            } catch (error) {
                console.log('Invalid token');
                return next(new Error('Unauthorized'));
            }
        });
    }
    //Client connect
    handleConnection(client: Socket): void {
        console.log(`Client connected: ${client.id}`);
    }
    //Client disconnect
    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join-post-room')
    handleJoinPostRoom(
        @MessageBody() data: PostRoomDto,
        @ConnectedSocket() client: Socket
    ) {
        const room = `post_${data.postId}`
        client.join(room);
        console.log(`Client ${client.id} joined room ${room}`);
        return {
            status: 'joined'
        }
    }

    @SubscribeMessage('leave-post-room')
    handleLeavePost(
        @MessageBody() data: PostRoomDto,
        @ConnectedSocket() client: Socket
    ) {
        const room = `post_${data.postId}`
        client.leave(room);
        console.log(`Client ${client.id} leaved room ${room}`);
        return { stats: 'leaved' }
    }

    @SubscribeMessage('send-comment')
    async handleSendComment(
        @MessageBody() body: { postId: number, content: string },
        @ConnectedSocket() client: Socket
    ) {
        try {
            const user = client.data.user;
            if (!user || typeof user.id !== 'number') {
                throw new WsException('Invalid user payload');
            }
            const { postId, content } = body;
            const createCommentDto: CreateComment = { content };
            const newComment = await this.commentsService.createComment(postId, user.id, createCommentDto)
            this.emitSendMessage(postId, newComment);
            console.log(`Send comment success ${postId} for ${client.id}`);
            console.log(newComment);


            return { status: 'OK' }
        } catch (error) {
            return error;
        }
    }

    //xử lý emit đến toàn bộ người dùng ở trong bài post
    emitSendMessage(postId: number, comment: any) {
        const room = `post_${postId}`
        this.server.to(`post_${postId}`).emit('new-comment', {
            postId,
            comment: {
                id: comment.id,
                content: comment.content,
                user: {
                    id: comment.user.id,
                    username: comment.user.username,
                    avatarUrl: comment.user.avatarUrl
                }
            }
        });
        console.log(`Emit new comment to room: ${room}`);
    }

    emitDeleteMessage(postId: number, commentId: number) {
        const room = `post_${postId}`;
        this.server.to(`post_${postId}`).emit('deleteComment', commentId);
        console.log(`Emit delete commentId ${commentId} to room ${room}`);
    }

}