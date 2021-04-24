import {Injectable, Inject, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from '../entities/Group.entity';
import { InjectRepository } from "@nestjs/typeorm";
import ContractConnector from "../web3/ContractConnector";
import {Index} from "../entities/Index.entity";
import {LastBlock} from "../entities/LastBlock.entity";
import {Transaction} from "../entities/Transaction.entity";

@Injectable()
export class DatabaseService {

    contractConnector: ContractConnector = new ContractConnector()

    constructor(
        @InjectRepository(Group) private groupRepository: Repository<Group>,
        @InjectRepository(Index) private indexRepository: Repository<Index>,
        @InjectRepository(LastBlock) private lastBlockRepository: Repository<LastBlock>,
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    ) {}

    async GetGroupIds () {
        let groupIds = await this.groupRepository.find()
        if (groupIds.length) {
            return JSON.stringify(groupIds.map(group => group.id));
        } else {
            throw new HttpException("Cannot get group ids", 400)
        }
    }

    async GetGroup (id: number) {
        const group = await this.groupRepository.findOne(id)
        const indexes = await this.indexRepository.find({ groupId: id })
        if (group) {
            delete group.id;
            group.indexes = indexes.map(index => index.id)
            return JSON.stringify(group)
        } else {
            throw new HttpException(`Group with id ${id} not found`, 404)
        }
    }

    async GetIndex (id: number) {
        const index = await this.indexRepository.findOne(id)
        if (index) {
            delete index.id;
            return JSON.stringify(index)
        } else {
            throw new HttpException(`Index with id ${id} not found`, 404)
        }
    }

    async GetBlock () {
        const block = await this.lastBlockRepository.findOne();
        const transactions = await this.transactionRepository.find({ lastBlockId: block.id });
        block.transactions = transactions.map(transaction => transaction.code);
        delete block.id;
        return JSON.stringify(block);
    }
}