
export interface ILikePostResponse{
    message: string,
    userId: number,
    postId: number,
    likeCount: number,
    commentCount: number,
    isLike: boolean
}