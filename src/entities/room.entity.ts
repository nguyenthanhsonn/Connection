import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./users.entity";
import { RoomType } from "../enum/room.enum";

@Entity('Room')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @ManyToMany(() => Users, user => user.rooms, { eager: true })
    @JoinTable({
        name: 'room_members',
        joinColumn: { name: 'roomId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    members: Users[];

    @Column({
        type: 'enum',
        enum: RoomType,
        default: RoomType.personal
    })
    type: RoomType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
