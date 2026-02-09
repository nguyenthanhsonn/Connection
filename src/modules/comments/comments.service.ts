import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comments.entity';
import { Repository } from 'typeorm';
import { CreateComment } from './dtos/create-comment.dto';
import { ICommentResponse, IGetComment } from './interface/comment.interface';
import { Users } from 'src/entities/users.entity';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Post) private readonly postRepo: Repository<Post>
    ) { }

    async createComment(postId: number, userId: number, cmtDto: CreateComment): Promise<ICommentResponse> {
        // perf-optimize-database: Sử dụng Promise.all để kiểm tra sự tồn tại của cả User và Post đồng thời.
        const [user, post] = await Promise.all([
            this.userRepo.findOne({ where: { id: userId } }),
            this.postRepo.findOne({ where: { id: postId } })
        ]);

        if (!user) throw new NotFoundException('Người dùng không tồn tại');
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        const newComment = this.commentRepo.create({
            content: cmtDto.content,
            user: { id: userId },
            post: { id: postId }
        });

        const savedComment = await this.commentRepo.save(newComment);

        return {
            message: 'Đăng bình luận thành công',
            id: savedComment.id,
            content: savedComment.content,
            user: {
                id: user.id,
                username: user.userName,
                avatarUrl: user.avatarUrl
            }
        };
    }

    async deleteComment(commentId: number, userId: number, postId: number): Promise<{ message: string }> {
        // perf-optimize-database: Gộp kiểm tra tồn tại và quyền sở hữu vào 1 query duy nhất.
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId,
                user: { id: userId },
                post: { id: postId }
            }
        });

        if (!comment) throw new NotFoundException('Bình luận không tồn tại hoặc bạn không có quyền xoá');

        await this.commentRepo.delete(commentId);
        return { message: 'Xoá bình luận thành công' };
    }

    async getCommentByPostID(userId: number, postId: number): Promise<IGetComment> {
        const post = await this.postRepo.findOne({
            where: { id: postId }
        });
        if (!post) throw new NotFoundException('Bài post không tồn tại');
        const comment = await this.commentRepo.find({
            where: {
                post: { id: postId }
            },
            relations: ['user'],
            order: { createdAt: 'ASC' }
        });
        return {
            message: 'Success',
            comments: comment.map((cm) => ({
                id: cm.id,
                content: cm.content,
                user: {
                    id: cm.user.id,
                    username: cm.user.userName,
                    avatarUrl: cm.user.avatarUrl
                }
            }))
        };
    }
}
