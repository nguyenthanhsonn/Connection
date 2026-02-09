import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { Users } from "./users.entity";

@Entity('Post_Likes')
export class Post_Like {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post
    @ManyToOne(() => Users, (user) => user.postLikes)
    @JoinColumn({ name: 'user_id' })
    user: Users
}