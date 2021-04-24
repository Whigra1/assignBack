import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseController} from "./database/database.controller";
import {DatabaseService} from "./database/database.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Group} from "./entities/Group.entity";
import {Index} from "./entities/Index.entity";
import {LastBlock} from "./entities/LastBlock.entity";
import {Transaction} from "./entities/Transaction.entity";
import {CacheModule} from "@nestjs/common";

describe('DatabaseController', () => {
  let groupController: DatabaseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Group, Index, LastBlock, Transaction]), CacheModule.register()],
      controllers: [DatabaseController],
      providers: [DatabaseService],
    }).compile();

    groupController = app.get<DatabaseController>(DatabaseController);
  });

  describe('root', () => {
    it('should return "[12, 13]"', () => {
      expect(groupController.GetGroupIds()).toBe('[12, 13]');
    });
  });
});
