import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class AppGetawayController implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.info("Socket.IO Server initialized");
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.info(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.info(`Client disconnected: ${client.id}`);
    }

    // Escuchar mensajes del cliente:
    @SubscribeMessage('alarm')
    handleAlarm(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: any
    ): any {
        console.info("Alarm message received: ", payload);

        // Responder al cliente que envió el mensaje
        client.emit('alarm', {
            status: 'received',
            message: 'Alarm processed successfully',
            originalPayload: payload,
            timestamp: new Date().toISOString()
        });

        // Opcionalmente, broadcast a todos los clientes conectados
        this.server.emit('alarm_broadcast', {
            type: 'alarm',
            data: payload,
            from: client.id,
            timestamp: new Date().toISOString()
        });

        return { status: 'ok' };
    }
}