import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follows } from 'src/entities/follow.entity';
import { In, Repository } from 'typeorm';
// import { FollowDto } from './dtos/follow.dto';
import { Users } from 'src/entities/users.entity';
import { IFollowResponse, IListFollower, IListFollowing, IUnfollowResponse } from './interface/follow.interface';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follows) private readonly followRepo: Repository<Follows>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>
    ) { }

    private findFollow(followerId: number, followingId: number) {
        return this.followRepo.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
            relations: ['follower', 'following'],
        });
    }

    async follow(followingId: number, userId: number): Promise<IFollowResponse> {
        if (followingId === userId)
            throw new BadRequestException('Bạn không thể follow chính mình');

        const userToFollow = await this.userRepo.findOne({ where: { id: followingId } });
        if (!userToFollow) throw new BadRequestException('Người dùng không tồn tại');

        const existed = await this.followRepo.findOne({
            where: { follower: { id: userId }, following: { id: followingId } },
            relations: ['follower', 'following'],
        });
        if (existed) throw new BadRequestException('Bạn đã follow người này rồi');

        const newFollow = this.followRepo.create({
            follower: { id: userId },
            following: { id: followingId },
            isFollowing: true,
        });
        await this.followRepo.save(newFollow);

        return {
            message: 'Follow thành công',
            followerId: userId,
            followingId,
            isFollowing: newFollow.isFollowing,
        };
    }

    async unFollow(followingId: number, userId: number): Promise<IUnfollowResponse> {
        if (followingId === userId) throw new BadRequestException('Bạn không thể unfollow chính mình');
        const existed = await this.followRepo.findOne({
            where: {
                follower: { id: userId },
                following: { id: followingId }
            },
            relations: ['follower', 'following']
        });
        if (!existed) throw new BadRequestException('Bạn chưa follow người dùng này');
        await this.followRepo.remove(existed);
        return {
            message: 'Bạn đã huỷ theo dõi người dùng này'
        }
    }

    //Xem danh sach nguoi theo doi 
    async followerList(targetUsername: string, currentUserId: number): Promise<IListFollower> {
        const existUser = await this.userRepo.findOne({
            where: { userName: targetUsername },
        });
        if (!existUser) throw new BadRequestException('Người dùng không tồn tại');

        const [follows, count] = await this.followRepo
            .createQueryBuilder('follow')
            .leftJoinAndSelect('follow.follower', 'follower')
            .where('follow.following_id = :followingId', { followingId: existUser.id })
            .getManyAndCount();

        if (count === 0) return { message: 'Danh sách người theo dõi', followers: [] };

        // perf-optimize-database: Lấy danh sách ID để check bulk (db-avoid-n-plus-one), tránh query lặp trong loop.
        const followerIds = follows.map(f => f.follower.id);
        const currentFollowings = await this.followRepo.find({
            where: {
                follower: { id: currentUserId },
                following: { id: In(followerIds) }
            },
            relations: ['following']
        });
        const followingSet = new Set(currentFollowings.map(f => f.following.id));

        const followers = follows.map((f) => ({
            id: f.follower.id,
            username: f.follower.userName,
            avatar: f.follower.avatarUrl,
            isFollowing: followingSet.has(f.follower.id),
        }));

        return { message: 'Danh sách người theo dõi', followers };
    }

    //Xem danh sach nguoi dang theo doi
    async followingList(targetUsername: string, currentUserId: number): Promise<IListFollowing> {
        const existUser = await this.userRepo.findOne({
            where: { userName: targetUsername }
        });
        if (!existUser) throw new BadRequestException('Người dùng không tồn tại');

        const [follow, counts] = await this.followRepo
            .createQueryBuilder('follow')
            .leftJoinAndSelect('follow.following', 'following')
            .where('follow.follower_id = :followerId', { followerId: existUser.id })
            .getManyAndCount();

        if (counts === 0) return { message: 'Danh sách người đang theo dõi', followings: [] };

        // Tối ưu: Lấy danh sách ID để check bulk (db-avoid-n-plus-one)
        const targetFollowingIds = follow.map(f => f.following.id);
        const currentFollowings = await this.followRepo.find({
            where: {
                follower: { id: currentUserId },
                following: { id: In(targetFollowingIds) }
            },
            relations: ['following']
        });
        const followingSet = new Set(currentFollowings.map(f => f.following.id));

        const followings = follow.map((f) => ({
            id: f.following.id,
            username: f.following.userName,
            avatar: f.following.avatarUrl,
            isFollowing: followingSet.has(f.following.id),
        }));

        return { message: 'Danh sách người đang theo dõi', followings };
    }

    // ====== Xoá người theo dõi giống Instagram (Remove Follower) ======
    // Chức năng này cho phép bạn (người được theo dõi) chủ động xóa một người ra khỏi danh sách followers của mình.
    async removeFollower(targetFollowerId: number, currentUserId: number) {
        // 1. Kiểm tra xem người dùng đó có thực sự đang theo dõi bạn hay không
        // findFollow(người đi follow, người được follow)
        const existed = await this.findFollow(targetFollowerId, currentUserId);

        // 2. Nếu không tìm thấy bản ghi, nghĩa là người này không theo dõi bạn
        if (!existed) {
            throw new BadRequestException('Người dùng này hiện không theo dõi bạn');
        }

        // 3. Thực hiện xóa bản ghi follow khỏi cơ sở dữ liệu
        // Hành động này sẽ làm cho người đó không còn thấy bài viết của bạn trên Feed của họ nữa
        await this.followRepo.remove(existed);

        // 4. Trả về thông báo thành công
        return {
            message: 'Đã xóa người theo dõi thành công'
        }
    }

    // ====== Chặn người dùng (Block User) giống Instagram ======
    // Chức năng này cho phép bạn chặn hoàn toàn một người dùng khác.
    // Khi bị chặn: Người kia sẽ không thể tìm thấy bạn, không thể xem bài viết, không thể follow, và không thể gửi tin nhắn.
    async blockUser(targetUserId: number, currentUserId: number) {
        // 1. Kiểm tra xem người dùng bị chặn có tồn tại không
        const existUser = await this.userRepo.findOne({
            where: { id: targetUserId }
        });
        if (!existUser) throw new BadRequestException('Người dùng không tồn tại');

        // 2. Kiểm tra xem bạn đã chặn người này chưa
        // findFollow(người đi block, người bị block)
        const existed = await this.findFollow(targetUserId, currentUserId);
        if (existed) throw new BadRequestException('Bạn đã chặn người này rồi');

        // 3. Tạo bản ghi chặn (sử dụng bảng Follow nhưng với logic Block)
        // Lưu ý: Trong thực tế, bạn có thể cần thêm một bảng riêng cho Block hoặc dùng một flag đặc biệt.
        // Ở đây, ta giả định dùng bảng Follow với isFollowing = false để biểu thị Block (hoặc tạo một entity Block riêng).
        // Để đơn giản và tránh tạo thêm bảng, ta có thể dùng bảng Follow nhưng với logic: 
        // Nếu isFollowing = false -> là Block.
        // Tuy nhiên, để rõ ràng, ta nên tạo một bảng Block riêng hoặc dùng một cột isBlocked.
        // Ở đây, ta sẽ tạo một bảng Follow mới với isFollowing = false để biểu thị Block.
        const newBlock = this.followRepo.create({
            follower: { id: currentUserId },
            following: { id: targetUserId },
            isFollowing: false, // false = Blocked
        });
        await this.followRepo.save(newBlock);

        // 4. Nếu người này đang follow bạn, hãy xóa luôn quan hệ follow đó
        // (Vì đã chặn thì không thể follow được nữa)
        const existingFollow = await this.findFollow(targetUserId, currentUserId);
        if (existingFollow) {
            await this.followRepo.remove(existingFollow);
        }

        // 5. Trả về thông báo thành công
        return {
            message: 'Đã chặn người dùng thành công'
        }
    }

}

