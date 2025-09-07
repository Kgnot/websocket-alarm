import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from "@nestjs/common";

async function bootstrap() {

    const logger = new Logger();

    const app = await NestFactory.create(AppModule);
    // serve Angular from public:


    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    })

    const port = process.env.PORT || 3000;

    await app.listen(port);
    logger.log("CRunning on port: ", port)

}

bootstrap();
