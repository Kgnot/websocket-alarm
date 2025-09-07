import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';
import {UsersDataService} from "../users-data/usersDataService";
import {Logger} from "@nestjs/common";
import {v4 as uuidv4} from 'uuid';
import {Client} from "../model/client";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class AppGetawayController implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger();

    constructor(private usersDataService: UsersDataService) {
    }

    afterInit(server: Server) {
        this.logger.log("Socket.IO Server initialized");
    }

    handleConnection(client: Socket, ...args: any[]) {

        client.emit('request-register', {
            message: 'Por favor enviar la información'
        });

    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.usersDataService.removeClientBySocketId(client.id);
    }

    // Escuchar mensajes del cliente:

    @SubscribeMessage('request-register')
    handleRegister(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const newClient: Client = {
            id: uuidv4(),
            name: data.name,
            role: data.role,
            location: data.location,
            socketId: socket.id,
        }
        this.usersDataService.addClient(newClient);

        socket.emit('registered', {
            message: 'Registered successfully',
            client: newClient,
        })
    }


    @SubscribeMessage('alarm')
    handleAlarm(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const sender = this.usersDataService.getClientBySocket(client.id);

        console.info(
            `Alarm message received from ${sender?.name ?? 'Unknown'}: `,
            payload,
        );

        client.emit('alarm', {
            status: 'received',
            message: 'Alarm processed successfully',
            from: sender,
            originalPayload: payload,
            timestamp: new Date().toISOString(),
        });

        this.server.emit('alarm_broadcast', {
            type: 'alarm',
            data: payload,
            from: sender,
            timestamp: new Date().toISOString(),
        });

        return {status: 'ok'};
    }

    private sendAlarmToRoles(payload: any, sender?: Client) {

        const targetClients = this.usersDataService.getClientsByRoles(["cai"]);
        const targetSocketIds = targetClients
            .map(client => client.socketId)
            .filter(socketId => socketId !== undefined && socketId !== sender?.socketId) as string[];

        if (targetSocketIds.length > 0) {
            this.logger.log(`Sending alarm to ${targetSocketIds.length}`);

            // Enviar a cada socket individualmente
            targetSocketIds.forEach(socketId => {
                this.server.to(socketId).emit('alarm_notification', {
                    type: 'alarm',
                    data: payload,
                    from: sender,
                    timestamp: new Date().toISOString(),
                    message: `Nueva alarma de ${sender?.name || 'Usuario desconocido'}`
                });
            });
        } else {
            this.logger.log('No clients with alarm roles connected');
        }
    }
}