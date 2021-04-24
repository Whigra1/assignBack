import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Group } from "./Group.entity";

@Entity()
export class Index {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 500 })
    name: string;
    @Column()
    ethPriceInWei: number;
    @Column()
    usdPriceInCents: number;
    @Column()
    usdCapitalization: number;
    @Column()
    percentageChange: number;
    @Column()
    groupId: number;
    @ManyToOne(() => Group, group => group.id)
    group: Group;
}