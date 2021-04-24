import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "./database/database.module";
import { Group } from "./entities/Group.entity";
import { LastBlock } from "./entities/LastBlock.entity";
import { Index } from "./entities/Index.entity";
import { Transaction } from "./entities/Transaction.entity";
import { config } from 'dotenv';
config()

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [Group, Index, LastBlock, Transaction],
      }),
      DatabaseModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
