import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./users.entity";

@Entity('chat')
@Index(['roomId', 'createdAt'])
export class Chat{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomId: number;

    @Column()
    senderId: number;

    @ManyToOne(() => Users, sender => sender.chats,{onDelete: 'CASCADE'})
    sender: Users;

    @Column()
    message: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}