import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {LastBlock} from "./LastBlock.entity";
import {Group} from "./Group.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    code: string;
    @Column()
    lastBlockId: number
    @ManyToOne(() => LastBlock, block => block.id)
    lastBlock: LastBlock;
}