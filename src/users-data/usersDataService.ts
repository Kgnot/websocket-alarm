import {Injectable} from '@nestjs/common';
import {Client} from '../model/client';
import {Role} from "../model/role";

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

    getClientsByRole(role: string): Client[] {
        const transformRole = this.selectRol(role);
        return this.clientActiveList.filter(client => client.role === transformRole);
    }

    getClientsByRoles(roles: string[]): Client[] {
        const transformRoles: Role[] = roles.map(rol => this.selectRol(rol));
        return this.clientActiveList.filter(client => transformRoles.includes(client.role));
    }


    private selectRol(role: string) {
        switch (role.toUpperCase()) {
            case "CLIENT":
                return Role.CLIENT;
            case "CAI" :
                return Role.CAI
            default:
                return Role.CLIENT
        }
    }
}
