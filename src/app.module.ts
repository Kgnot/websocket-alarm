import {Module} from '@nestjs/common';
// import {ServeStaticModule} from '@nestjs/serve-static';
// import {join} from 'path';
import {AppGetawayModule} from './app-getaway/app-getaway.module';

@Module({
    imports: [
        // serve angular static
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, 'app-frontend', 'browser'),
        //     exclude: ['/api*', '/socket.io*'], // ← Cambio aquí
        // }),
        AppGetawayModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
