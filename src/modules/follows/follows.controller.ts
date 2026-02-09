import { Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FollowDto } from './dtos/follow.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('Follow')
@Controller('follow')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}
  
  // Lấy danh sách followers của user
  @Get(':username/followers')
  @ApiOperation({summary: 'Danh sách follower của user'})
  @ApiResponse({status: 200})
  @ApiParam({name: 'username', type: String, description: 'Tên người dùng'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getListFollower(@Param('username') username: string, @Req() req){
      return this.followsService.followerList(username, req.user.id);
  }

  // Lấy danh sách following của user
  @Get(':username/following')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getListFollowing(@Param('username') username: string, @Req() req){
    return this.followsService.followingList(username, req.user.id);
  }

  @Post(':id')
  @ApiOperation({summary: 'Follow người dùng'})
  @ApiResponse({status: 201, description: 'Bạn đã follow'})
  @ApiParam({name: 'id', type: Number, description: 'ID của người muốn follow'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async followUser(@Param('id', ParseIntPipe) id: number, @Req() req){
    // console.log(`ID: ${id}`);
    return this.followsService.follow(id, req.user.id)
  }

  @Delete(':id')
  @ApiOperation({summary: 'Unfollow người dùng'})
  @ApiResponse({status: 200, description: 'Bạn đã unfollow'})
  @ApiParam({name: 'id', type: Number, description: 'ID của người muốn unfollow'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async unFollowUser(@Param('id', ParseIntPipe) id: number, @Req() req){
    return this.followsService.unFollow(id, req.user.id)
  }
}
