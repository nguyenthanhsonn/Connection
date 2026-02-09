import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity('Role')
export class Roles{
    @PrimaryGeneratedColumn()
    id: number
    @Column({name: 'role_name'})
    roleName: string

    @ManyToMany(() => Users, (user)=>user.roles)
    users: Users[]
}