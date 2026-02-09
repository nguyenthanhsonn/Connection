
export interface IPostIDResponse{
    message: string,
    id: number,
    caption: string,
    images: string[],
    createdAt: Date,
    likeCount: number,
    saveCount: number,
    commentCount: number,
    /*User đăng bài */
    user: {
        id: number,
        username: string,
        avatarUrl: string | null
    }
    // User hiện tại đã like hoặc save chưa
    isLiked: boolean,
    isSaved: boolean,
}