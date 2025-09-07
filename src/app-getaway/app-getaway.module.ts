import {Module} from '@nestjs/common';
import {AppGetawayController} from "./app-getaway.controller";
import {UsersDataService} from "../users-data/usersDataService";

@Module({
    providers: [AppGetawayController,UsersDataService]
})
export class AppGetawayModule {
}
