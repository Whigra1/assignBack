import ContractConnector from "../web3/ContractConnector";
import {createConnection, Repository} from "typeorm";
import { Group } from '../entities/Group.entity'
import { Index } from "../entities/Index.entity";
import { LastBlock } from "../entities/LastBlock.entity";
import { Transaction } from "../entities/Transaction.entity";
async function main() {
    const contractConnector = new ContractConnector();

    const connection = await createConnection({
        type: 'sqlite',
        database: 'database.db',
        synchronize: true,
        logging: false,
        entities: [Group, Index, LastBlock, Transaction],
    })
    const queryRunner = connection.createQueryRunner();
    const groupRepository = connection.getRepository<Group>(Group);
    const indexRepository = connection.getRepository<Index>(Index);
    const lastBlockRepository = connection.getRepository<LastBlock>(LastBlock);
    const transactionRepository = connection.getRepository<Transaction>(Transaction);

    console.log("Getting excluded groups ids from db")
    const excludedGroupsIds = (await groupRepository.find())
        .reduce((acc, val) => {
            acc[val.id] = true;
            return acc;
        }, {});
    console.log('Done.')
    console.log("Getting excluded indexes ids from db")
    const excludedIndexesIds = (await indexRepository.find())
        .reduce((acc, val) => {
            acc[val.id] = true;
            return acc;
        }, {});
    console.log('Done.')

    console.log("Getting group ids from contract")
    const groups = await contractConnector.GetGroupIds();
    console.log("Done.")

    const isLastBlockExistsInDb = (await lastBlockRepository.find()).length > 0
    if (!isLastBlockExistsInDb) {
        console.log("Getting last-block from contract")
        const lastBlockObj = await contractConnector.GetBlock();
        console.log("Done.")
        const transactions = lastBlockObj.transactions;

        console.log('Saving last block to db')
        const lastBlock = await lastBlockRepository.save(lastBlockObj as LastBlock);
        console.log("Done.")

        console.log('Saving transactions to db')
        for (const transaction of transactions) {
            console.log(`Saving transaction ${transaction}`)
            await transactionRepository.save<Transaction>({code: transaction, lastBlockId: lastBlock.id} as Transaction)
            console.log('Done')
        }
    }

    for (const g of groups) {
        const groupId = Number(g);
        if (excludedGroupsIds[groupId]) {
            console.log(`Group ${groupId} exists. Skip`)
            continue;
        }
        console.log(`Getting group ${groupId} from contract`)
        const group = await contractConnector.GetGroup(groupId);
        group.id = groupId
        console.log(`Done`)
        await queryRunner.startTransaction()
        console.log(`Saving group ${groupId} to DB`)
        try {
            const savedGroup = await groupRepository.save<Group>(group as Group);
            console.log(`Done.`)

            for (const ind of group.indexes) {
                if (excludedIndexesIds[ind]) {
                    console.log(`Index ${ind} exists. Skip`)
                    continue;
                }
                console.log(`Getting index ${ind} from contract`)
                const index = await contractConnector.GetIndex(ind);
                index.id = ind;
                index.groupId = savedGroup.id;
                console.log(`Done`)

                console.log(`Saving index ${ind} to DB`)
                await indexRepository.save<Index>(index as Index)
                console.log(`Done`)
            }
           await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
        }

    }
}

main()

