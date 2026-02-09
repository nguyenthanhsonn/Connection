export interface ISavePostResponse{
    message: string,
    posts:{
        id: number,
        images: string | null,
        caption: string | null,
        isSaved: boolean,
        user: {
            id: number,
            username: string,
            avatarUrl: string | null
        }
    }[];
}