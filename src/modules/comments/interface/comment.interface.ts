import { IsNumber } from "class-validator"

export interface IComment{
    id: number,
    content: string,
    user:{
        id: number,
        username: string,
        avatarUrl: string
    }
}

export interface ICommentResponse extends IComment{
    message: string
}

export interface IGetComment{
    message: string,
    comments: IComment[]
}

