import {Injectable} from '@nestjs/common';
import {Client} from '../model/client';

@Injectable()
export class UsersDataService {
    private clientActiveList: Client[] = [];

    addClient(client: Client) {
        this.clientActiveList = [...this.clientActiveList, client];
    }

    removeClient(id: string) {
        this.clientActiveList = this.clientActiveList.filter(
            (client) => client.id !== id,
        );
    }

    removeClientBySocketId(socketId: string) {
        this.clientActiveList = this.clientActiveList.filter(
            (client) => client.socketId !== socketId,
        );
    }

    getClients(): Client[] {
        return this.clientActiveList;
    }

    getClientById(id: string): Client | undefined {
        return this.clientActiveList.find((client) => client.id === id);
    }

    getClientBySocket(socketId: string): Client | undefined {
        return this.clientActiveList.find((client) => client.socketId === socketId);
    }
}
