import { Column, Entity, EntityManager, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Post } from "./post.entity";



@Entity('Post_Saves')
export class PostSave{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (u) => u.postSaves, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: Users;

    @ManyToOne(() => Post, (p) => p.postSave, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'post_id'})
    post: Post

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}