import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./role.entity";
import { Follows } from "./follow.entity";
import { Post } from "./post.entity";
import { Post_Like } from "./post-like.entity";
import { PostSave } from "./post-saves.entity";
import { Notificaiton } from "./notificcation.entity";
import { Chat } from "./chat.entity";
import { Room } from "./room.entity";


@Entity('Users')
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({ name: 'user_name' })
    userName: string

    @Column({ name: 'pass_word' })
    passWord: string

    @Column({ name: 'avatar_url', nullable: true, default: '' })
    avatarUrl: string

    @Column({ name: 'bio_text', nullable: true, default: '' })
    bioText: string

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    @ManyToMany(() => Roles, role => role.users)
    @JoinTable({ name: 'user_roles' })
    roles: Roles[]

    // Danh sach nhung nguoi ma user theo doi
    @OneToMany(() => Follows, fl => fl.follower)
    follwings: Follows[]

    //Danh sach nhung nguoi dang theo doi user nay
    @OneToMany(() => Follows, fl => fl.following)
    followers: Follows[]

    //Danh sach bai dang cua user
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Post_Like, (pl) => pl.user)
    postLikes: Post_Like[]

    @OneToMany(() => PostSave, (ps) => ps.user)
    postSaves: PostSave[]

    @OneToMany(() => Notificaiton, (noti) => noti.senderId)
    sentNotification: Notificaiton[]

    @OneToMany(() => Notificaiton, (noti) => noti.receiverId)
    receiveNotification: Notificaiton[]

    @OneToMany(() => Chat, (chat) => chat.sender)
    chats: Chat[]

    @ManyToMany(() => Room, room => room.members)
    rooms: Room[]
}