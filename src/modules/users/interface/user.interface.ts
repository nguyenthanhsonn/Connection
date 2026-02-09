export interface IUsers{
    id: number,
    email?: string
    username: string
    avatarUrl?: string | null
    bioText?: string
    followerCount?: number
    followingCount?: number
    postCount?: number
}

export interface IRegister extends IUsers{
    message: string
}

export interface ILogin extends IUsers{
    message: string
    token: string
}

export interface IProfile extends IUsers{
    message: string
}

export interface IUserChat{
    id: number,
    username: string,
    avatarUrl?: string | null
}