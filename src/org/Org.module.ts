import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrgController } from './Org.controller';
import { OrgService } from './Org.service';
import { Org } from './Org.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Org])],
    controllers: [OrgController],
    providers: [OrgService],
    exports: [OrgService],
})
export class OrgModule { }