
export interface IFollow{
    followerId: number
    followingId: number
    isFollowing: boolean
}

export interface IFollowResponse extends IFollow{
    message: string
}

export interface IUnfollowResponse{
    message: string
}

export interface IListFollow{
    id: number
    username: string
    avatar: string
    isFollowing: boolean
}

export interface IListFollower{
    message: string
    followers: IListFollow[],
}

export interface IListFollowing{
    message: string,
    followings: IListFollow[]
}