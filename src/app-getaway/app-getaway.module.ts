import {Module} from '@nestjs/common';
import {AppGetawayController} from "./app-getaway.controller";

@Module({
    providers: [AppGetawayController]
})
export class AppGetawayModule {
}
