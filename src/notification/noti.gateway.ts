import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {origin: '*'},
    namespace: 'notifications'
})

export class NotiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    afterInit(server: Server) {
        console.log('Comment Gateway Initialized');
        // Them middleware
        server.use(async (socket: Socket, next)=>{
            const token = socket.handshake.headers['token'] ?? socket.handshake.headers.token;
            if(!token || typeof token !== 'string'){
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
    handleConnection(client: Socket) :void {
        console.log(`Client connected: ${client.id}`);
    }
    //Client disconnect
    handleDisconnect(client: Socket) :void {
        console.log(`Client disconnected: ${client.id}`);
    }
    // Phương thức gửi thông báo đến một người dùng/máy khách cụ thể
    public notifyUser(userId: number, notifyData: any){
        this.server.emit('notification', notifyData)
    };

    @SubscribeMessage('sentNotify')
    handleSentMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: any
    ){
        
    }
}