import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity('Post_Images')
export class Post_Images{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, (post) => post.postImages, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'post_id'})
    post: Post;

    @Column({ name: 'image_url', type: 'text', nullable: true })
    imageUrl: string;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    
    @Column({name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}