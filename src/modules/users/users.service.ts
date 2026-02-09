import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { generateRandomUsername, generateUsernameFromEmail } from 'src/utils/randomUsername.util';
import { ReigsterDto } from './dto/register.dto';
import { ILogin, IProfile, IRegister, IUserChat } from './interface/user.interface';
import { Not, NumericType, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { Roles } from 'src/entities/role.entity';
import { RolesEnum } from 'src/enum/role.enum';
import { LoginDto } from './dto/login.dto';
import { generateToken } from 'src/utils/generateToken.util';
import { UpdateProfile } from './dto/updateProfile.dto';
import { use } from 'passport';
import { User } from './dto/user.dto';
import { Follows } from 'src/entities/follow.entity';
import { Post } from 'src/entities/post.entity';
import { PostSave } from 'src/entities/post-saves.entity';
import { notStrictEqual } from 'assert';
import { ISavePostResponse } from './interface/postSaveForUser.interface'


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Roles) private readonly roleRepo: Repository<Roles>,
        @InjectRepository(Follows) private readonly followRepo: Repository<Follows>,
        @InjectRepository(Post) private readonly postRepo: Repository<Post>,
        @InjectRepository(PostSave) private readonly saveRepo: Repository<PostSave>
    ) { }

    async registerUser(dto: ReigsterDto): Promise<IRegister> {
        const exitsUser = await this.userRepo.findOne({
            where: { email: dto.email }
        })
        if (exitsUser) throw new BadRequestException('Email đã tồn tại');

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const username = await generateUsernameFromEmail('user');

        //Gán role cho người dùng
        let role = await this.roleRepo.findOne({ where: { roleName: RolesEnum.User } });
        if (!role) {
            role = this.roleRepo.create({ roleName: RolesEnum.User });
            await this.roleRepo.save(role);
        }
        const newUser = await this.userRepo.create({
            email: dto.email,
            passWord: hashPassword,
            userName: username,
            roles: [role]
        });
        await this.userRepo.save(newUser);
        return {
            message: 'Tạo tài khoản thành công',
            id: newUser.id,
            email: newUser.email,
            username: newUser.userName,
        }
    }

    async login(dto: LoginDto): Promise<ILogin> {
        const exitsUser = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!exitsUser) throw new UnauthorizedException('Người dùng không tồn tại');

        //Kiem tra password
        const isPassword = await bcrypt.compare(dto.password, exitsUser.passWord);
        if (!isPassword) throw new UnauthorizedException('Email/Mật khẩu không đúng');
        const token = generateToken(exitsUser);
        return {
            message: 'Đăng nhập thành công',
            id: exitsUser.id,
            email: exitsUser.email,
            username: exitsUser.userName,
            avatarUrl: exitsUser.avatarUrl || null,
            token: token
        }
    }

    async updated(dto: UpdateProfile, userId: number): Promise<IProfile> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('Tài khoản không tồn tại');
        // perf-optimize-database: Sử dụng id: Not(userId) để loại bỏ bản ghi hiện tại khi check trùng,
        // giúp user có thể nhấn 'Lưu' mà không cần đổi giá trị nếu giá trị đó là của chính họ.
        if (dto.email && dto.email !== user.email) {
            const checkEmail = await this.userRepo.findOne({
                where: { email: dto.email, id: Not(userId) }
            });
            if (checkEmail) throw new ConflictException('Email đã tồn tại');
        }

        if (dto.username && dto.username !== user.userName) {
            const checkUsername = await this.userRepo.findOne({
                where: { userName: dto.username, id: Not(userId) }
            });
            if (checkUsername) throw new ConflictException('Username đã tồn tại');
        }

        user.email = dto.email ?? user.email;
        user.userName = dto.username ?? user.userName;
        user.avatarUrl = dto.avatarUrl ?? user.avatarUrl;
        user.bioText = dto.bioText ?? user.bioText;

        const updateUser = await this.userRepo.save(user);
        return {
            message: 'Cập nhật thành công',
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.userName,
            avatarUrl: updateUser.avatarUrl,
            bioText: updateUser.bioText
        }
    }

    // Lấy user theo username
    async getUserByUsername(username: string, userId: number): Promise<IProfile> {
        const user = await this.userRepo.findOne({
            where: { userName: username }
        });
        if (!user) throw new NotFoundException('Người dùng không tồn tại');

        // Query song song để tối ưu thời gian chờ (perf-optimize-database)
        const [followerCount, followingCount, postCount] = await Promise.all([
            this.followRepo.count({ where: { following: { id: user.id } } }),
            this.followRepo.count({ where: { follower: { id: user.id } } }),
            this.postRepo.count({ where: { user: { id: user.id } } })
        ]);

        const isSelf = username === user.userName;
        return {
            message: 'Success',
            id: user.id,
            email: isSelf ? user.email : undefined,
            username: user.userName,
            avatarUrl: user.avatarUrl,
            bioText: user.bioText,
            followerCount: followerCount,
            followingCount: followingCount,
            postCount: postCount,
        }
    }

    async getPostUsername(username: string) {
        const user = await this.userRepo.findOne({ where: { userName: username } });
        if (!user) throw new NotFoundException('Không tìm thấy người dùng');

        const posts = await this.postRepo.find({
            where: { user: { id: user.id } },
            relations: ['postImages', 'comments', 'postLikes'],
            order: { createdAt: 'DESC' },
        });

        return posts.map(p => ({
            id: p.id,
            caption: p.caption,
            images: p.postImages.map(i => i.imageUrl),
            createdAt: p.createdAt,
            likeCount: p.postLikes.length,
            commentCount: p.comments.length
        }));
    }

    async getPostSaveByUserId(userId: number): Promise<ISavePostResponse> {
        // arch-single-responsibility: Sử dụng private method để check tồn tại, giúp code gọn và dễ bảo trì.
        await this.findUserById(userId);
        const posts = await this.saveRepo.find({
            where: {
                user: { id: userId }
            },
            relations: ['post', 'post.postImages', 'post.postLikes', 'post.user'],
            order: { createdAt: 'DESC' }
        });

        if (posts.length === 0) {
            return {
                message: 'Không có bài lưu',
                posts: []
            };
        }
        return {
            message: 'Lấy danh sách bài đăng đã lưu thành công',
            posts: posts.map(p => ({
                id: p.post.id,
                images: p.post.postImages[0]?.imageUrl || '',
                caption: p.post.caption || null,
                isSaved: true,
                user: {
                    id: p.post.user.id,
                    username: p.post.user.userName,
                    avatarUrl: p.post.user.avatarUrl || null
                }
            }))
        };
    }

    async getUserById(userId: any): Promise<IUserChat> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng')
        }
        return {
            id: user.id,
            username: user.userName,
            avatarUrl: user.avatarUrl
        };
    }

    private async findByUserName(username: string) {
        const user = await this.userRepo.findOne({ where: { userName: username } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng')
        }
        return user;
    }

    private async findUserById(userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng')
        }
        return user;
    }
}
