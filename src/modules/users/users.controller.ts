import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReigsterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRegister } from './interface/user.interface'
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UpdateProfile } from './dto/updateProfile.dto';
import { User } from './dto/user.dto';

@ApiTags('User') // group trong swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
  @HttpCode(201)
  async register(@Body() dto: ReigsterDto) {
    return this.usersService.registerUser(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.usersService.login(dto)
  }

  @Put('profiles/edit')
  @ApiOperation({ summary: 'Cập nhật profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() dto: UpdateProfile, @Req() req) {
    return this.usersService.updated(dto, req.user.id);
  }

  @Get('profiles/:username')
  @ApiOperation({ summary: 'Xem profile' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của user cần xem' })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('username') username: string, @Req() req) {
    return this.usersService.getUserByUsername(username, req.user.id);
  }

  @Get('profile/:username')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPostByUsername(@Param('username') username: string, @Req() req) {
    return this.usersService.getPostUsername(username);
  }

  @Get('saved/all-posts')
  @ApiOperation({ summary: 'Bài đăng đã lưu của current user' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAllPostsSaved(@Req() req) {
    return this.usersService.getPostSaveByUserId(req.user.id);
  }
}
