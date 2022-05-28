import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as configDotenv } from 'dotenv'

async function bootstrap() {
    configDotenv()
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT);
}
bootstrap();
