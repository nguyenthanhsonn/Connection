import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity('Follow')
export class Follows {
    @PrimaryGeneratedColumn()
    id: number

    // Nguoi theo doi
    @ManyToOne(() => Users, (user) => user.follwings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follower_id' })
    follower: Users

    //Nguoi duoc theo doi
    @ManyToOne(() => Users, (user) => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'following_id' })
    following: Users

    // @
    @Column({ name: 'is_following' })
    isFollowing: boolean
}