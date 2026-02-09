import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn.js"
import { Users } from "./users.entity"
import { Post_Images } from "./post-images.entity"
import { Post_Like } from "./post-like.entity"
import { Comments } from "./comments.entity"
import { PostSave } from "./post-saves.entity"

@Entity('Posts')
export class Post{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, default: ''})
    caption: string;

    @ManyToOne(() => Users, (user) => user.posts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: Users;

    @OneToMany(() => Post_Images, (image) => image.post, {cascade: true, onDelete: 'CASCADE'})
    postImages: Post_Images[];

    @OneToMany(() => Post_Like, (pl) => pl.post, {cascade: true, onDelete: 'CASCADE'})
    postLikes: Post_Like[];

    @OneToMany(() => Comments, (comment) => comment.post, {cascade: true, onDelete: 'CASCADE'})
    comments: Comments[];

    @OneToMany(() => PostSave, (ps) => ps.post, {cascade: true, onDelete: 'CASCADE'})
    postSave: PostSave[]

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}