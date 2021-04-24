import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 512 })
    name: string;

    indexes: number [];
}