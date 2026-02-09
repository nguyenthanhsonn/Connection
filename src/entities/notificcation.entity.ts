import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Post } from "./post.entity";
import { Comments } from "./comments.entity";


@Entity('Notificaitons')
export class Notificaiton {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.sentNotification, { eager: true })
    @JoinColumn({ name: 'sender_id' })
    senderId: Users; //Người gửi hành động

    @ManyToOne(() => Users, (user) => user.receiveNotification, { eager: true })
    @JoinColumn({ name: 'receiver_id' })
    receiverId: Users; //Người nhận thông báo

    // Bài viết liên quan (nếu có)
    @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "post_id" })
    postId?: number

    //Bình luận liên quan (nếu có)
    @ManyToOne(() => Comments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "comment_id" })
    commentId?: number

    @Column()
    message: string

    @Column({ name: "is_read" })
    isRead: boolean

    @Column({ name: "created_at" })
    createdAt: Date
}