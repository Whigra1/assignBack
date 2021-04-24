import { Module, CacheModule } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Group } from "../entities/Group.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseController } from "./database.controller";
import {Index} from "../entities/Index.entity";
import {LastBlock} from "../entities/LastBlock.entity";
import {Transaction} from "../entities/Transaction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Group, Index, LastBlock, Transaction]), CacheModule.register()],
    providers: [DatabaseService],
    controllers: [DatabaseController],
})
export class DatabaseModule {}