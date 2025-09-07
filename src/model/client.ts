import {Role} from "./role";

export interface Client {
    id: Uint8Array<ArrayBufferLike>,
    name: string,
    role: Role,
    location: string,
    socketId?: string
}

