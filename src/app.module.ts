import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './User/User.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
