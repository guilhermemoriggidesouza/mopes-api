import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as configDotenv } from 'dotenv'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    configDotenv()
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
