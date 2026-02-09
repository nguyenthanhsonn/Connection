import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { User } from "src/modules/users/dto/user.dto";
import { Post } from "./post.entity";


@Entity('Comments')
export class Comments{
    @PrimaryGeneratedColumn()
    id: number
    @Column({type: 'text'})
    content: string
    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({name: 'user_id'})
    user: Users
    @ManyToOne(() => Post, (post)=> post.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'post_id'})
    post: Post
    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date
    @Column({name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date
}