export interface IPost {
    caption: string,
    imageUrls: string[]
}

export interface IPostResponse extends IPost {
    message: string
}

export interface IUpdatePostResponse extends IPost {
    message: string
}

export interface IPostListItem {
  posts: {
    id: number;
    caption: string;
    images: string[];
    createdAt: Date; // hoặc Date, tùy bạn trả về
    likeCount: number,
    commentCount: number;
    isLiked: boolean;
    isSaved: boolean;
    user: {
      id: number;
      username: string;
      avatarUrl: string | null;
    };
  }[];
}
