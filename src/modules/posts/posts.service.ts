import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { PostDto } from './dto/create-post.dto';
import { IPostListItem, IPostResponse, IUpdatePostResponse } from './interfaces/post.interface';
import { UpdatePost } from './dto/update-post.dto';
import { Post_Images } from 'src/entities/post-images.entity';
import { ISavePost } from './interfaces/save-posts.interface';
import { PostSave } from 'src/entities/post-saves.entity';
import { Comments } from 'src/entities/comments.entity';
import { Post_Like } from 'src/entities/post-like.entity';
import { Users } from 'src/entities/users.entity';
import { ILikePostResponse } from './interfaces/like-post.interface';
import { IPostIDResponse } from './interfaces/postId.interface';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>,
        @InjectRepository(Post_Images) private readonly postImagesRepo: Repository<Post_Images>,
        @InjectRepository(PostSave) private readonly postSaveRepo: Repository<PostSave>,
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>,
        @InjectRepository(Post_Like) private readonly postLikeRepo: Repository<Post_Like>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>
    ) { }

    async createPost(userId: number, postDto: PostDto): Promise<IPostResponse> {
        // map từ string[] sang object Post_Images[]
        const postImages = postDto.imageUrls?.map((url) => ({ imageUrl: url }));

        const newPost = this.postRepo.create({
            caption: postDto.caption,
            postImages: postDto.imageUrls ? postImages as DeepPartial<Post_Images>[] : [],
            user: { id: userId }
        });
        const savedPost = await this.postRepo.save(newPost);
        return {
            message: 'Đăng bài thành công',
            caption: savedPost.caption,
            imageUrls: savedPost.postImages?.map(img => img.imageUrl) || []
        }
    }

    async updatePost(userId: number, postId: number, postDto: UpdatePost): Promise<IUpdatePostResponse> {
        const post = await this.postRepo.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['postImages'],
        });
        if (!post) throw new Error('Bạn không có quyền sửa bài viết này hoặc bài viết không tồn tại');

        if (postDto.caption) {
            post.caption = postDto.caption;
        };
        // 🧩 2️⃣ Nếu có ảnh mới được gửi lên
        if (postDto.imageUrls && postDto.imageUrls.length > 0) {
            const oldUrls = post.postImages.map((img) => img.imageUrl);
            const newUrls = postDto.imageUrls.filter((url) => !oldUrls.includes(url));

            // 🧩 2.1️⃣ Tạo entity ảnh mới
            const newImages = newUrls.map((url) =>
                this.postImagesRepo.create({
                    imageUrl: url,
                    post: { id: post.id }, // gắn rõ quan hệ
                }),
            );

            // 🧩 2.2️⃣ Lưu ảnh mới vào DB
            if (newImages.length > 0) {
                await this.postImagesRepo.save(newImages);
                post.postImages.push(...newImages); // cập nhật lại mảng trong post
            }
        }
        const updatedPost = await this.postRepo.save(post);
        return {
            message: 'Cập nhật bài viết thành công',
            caption: updatedPost.caption,
            imageUrls: updatedPost.postImages?.map(img => img.imageUrl) || []
        };
    }

    async deletePost(userId: number, postId: number): Promise<{ message: string }> {
        // perf-optimize-database: Chỉ select trường cần thiết và quan hệ trực tiếp để giảm tải RAM/Network.
        const post = await this.postRepo.findOne({
            where: { id: postId },
            relations: ['user'],
            select: {
                id: true,
                user: { id: true }
            }
        });

        if (!post) throw new BadRequestException('Bài đăng này không còn tồn tại');
        if (post.user.id !== userId) throw new ForbiddenException('Bạn không có quyền xoá bài đăng này');

        await this.postRepo.delete(postId);
        return { message: 'Xoá bài viết thành công' };
    }

    async getAllPost(userId: number): Promise<IPostListItem> {
        const posts = await this.postRepo.find({
            relations: ['postImages', 'user', 'comments', 'postLikes'],
            order: { createdAt: 'DESC' }
        });

        //Lay danh sach postsId
        const postIds = posts.map(p => p.id);

        if (postIds.length === 0) {
            return {
                posts: []
            };
        }

        const savePostIds = await this.postSaveRepo
            .createQueryBuilder('save')
            .select('save.post_id', 'postId')
            .where('save.user_id = :userId', { userId })
            .andWhere('save.post_id IN (:...postIds)', { postIds })
            .getRawMany();

        const saveIds = new Set(savePostIds.map((row) => row.postId));

        const likePostIds = await this.postLikeRepo
            .createQueryBuilder('like')
            .select('like.post_id', 'postId')
            .where('like.user_id = :userId', { userId })
            .andWhere('like.post_id IN (:...postIds)', { postIds })
            .getRawMany()

        const likeIds = new Set(likePostIds.map((row) => row.postId));

        const gets = posts.map(p => ({
            id: p.id,
            caption: p.caption,
            images: p.postImages.map(i => i.imageUrl),
            createdAt: p.createdAt,
            likeCount: p.postLikes.length,
            commentCount: p.comments.length,
            isLiked: likeIds.has(p.id),
            isSaved: saveIds.has(p.id),
            user: {
                id: p.user.id,
                username: p.user.userName,
                avatarUrl: p.user.avatarUrl
            }
        }));
        return {
            posts: gets,
        }
    }

    async savePost(userId: number, postId: number): Promise<ISavePost> {
        // 1. Kiểm tra bài viết tồn tại (không dùng relations để tối ưu)
        const post = await this.postRepo.findOne({
            where: { id: postId },
            select: ['id'] // Chỉ lấy ID để tối ưu hiệu năng
        });
        if (!post) throw new BadRequestException('Bài đăng không còn tồn tại');

        // 2. Sử dụng Transaction để đảm bảo tính an toàn dữ liệu
        return await this.postRepo.manager.transaction(async (transactionalEntityManager) => {

            // Kiểm tra xem đã lưu chưa
            const existSaved = await transactionalEntityManager.findOne(PostSave, {
                where: {
                    user: { id: userId },
                    post: { id: postId }
                }
            });

            let isSaved = false;
            let message = '';
            let createdAt = new Date();

            if (existSaved) {
                // Trường hợp: Hủy lưu
                await transactionalEntityManager.remove(existSaved);
                message = 'Huỷ lưu bài thành công';
                createdAt = existSaved.createdAt;
                isSaved = false;
            } else {
                // Trường hợp: Lưu mới
                const newSave = transactionalEntityManager.create(PostSave, {
                    user: { id: userId },
                    post: { id: postId }
                });
                const saved = await transactionalEntityManager.save(newSave);
                message = 'Lưu bài thành công';
                createdAt = saved.createdAt;
                isSaved = true;
            }

            // 3. Lấy lại count mới nhất SAU khi đã thay đổi
            const saveCount = await transactionalEntityManager.count(PostSave, {
                where: { post: { id: postId } }
            });

            return {
                message,
                userId,
                postId,
                saveCount,
                createdAt,
                isSaved
            };
        });
    }

    async likePost(userId: number, postId: number): Promise<ILikePostResponse> {
        const existPost = await this.postRepo.findOne({
            where: { id: postId },
            relations: ['postLikes']
        });
        if (!existPost) throw new BadRequestException('Bài đăng không còn tồn tại');
        const existedLike = await this.postLikeRepo.findOne({
            where: {
                user: { id: userId },
                post: { id: postId }
            }
        });

        const commentCount = await this.commentRepo.count({
            where: { post: { id: postId } }
        });

        if (existedLike) {
            await this.postLikeRepo.remove(existedLike);
            const likeCount = await this.postLikeRepo.count({ where: { post: { id: postId } } });
            return {
                message: 'Huỷ like bài đăng thành công',
                postId,
                userId,
                likeCount,
                commentCount,
                isLike: false
            };
        }

        // Nếu chưa like
        const newLike = this.postLikeRepo.create({
            user: { id: userId },
            post: { id: postId }
        });
        await this.postLikeRepo.save(newLike);
        const likeCount = await this.postLikeRepo.count({ where: { post: { id: postId } } });
        return {
            message: 'Like bài đăng thành công',
            userId: userId,
            postId: postId,
            likeCount,
            commentCount,
            isLike: true
        }
    }

    async getPostById(userId: number, postId: number): Promise<IPostIDResponse> {
        const post = await this.postRepo.findOne(
            {
                where: { id: postId },
                relations: ['postImages', 'postLikes', 'postSave', 'user']
            });
        if (!post) throw new NotFoundException('Bài đăng không còn tồn tại');

        // perf-optimize-database: Sử dụng Promise.all để query song song các thông tin đếm, rút ngắn thời gian phản hồi.
        const [likedCount, savedCount, commentCount, isLiked, isSaved] = await Promise.all([
            this.postLikeRepo.count({ where: { post: { id: postId } } }),
            this.postSaveRepo.count({ where: { post: { id: postId } } }),
            this.commentRepo.count({ where: { post: { id: postId } } }),
            this.postLikeRepo.exists({ where: { user: { id: userId }, post: { id: postId } } }),
            this.postSaveRepo.exists({ where: { user: { id: userId }, post: { id: postId } } })
        ]);

        return {
            message: 'Lấy bài đăng thành công',
            id: post.id,
            caption: post.caption,
            images: post.postImages.map((i) => i.imageUrl),
            createdAt: post.createdAt,
            likeCount: likedCount,
            saveCount: savedCount,
            commentCount: commentCount,
            user: {
                id: post.user.id,
                username: post.user.userName,
                avatarUrl: post.user.avatarUrl
            },
            isLiked,
            isSaved
        }
    }
}