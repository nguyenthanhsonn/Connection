import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PostDto } from './dto/create-post.dto';
import { CommentsService } from '../comments/comments.service';
import { CreateComment } from '../comments/dtos/create-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentService: CommentsService
  ) {}

  @Get()
  @ApiOperation({summary: 'Lấy tất cả bài post của tất cả người dùng'})
  @ApiResponse({status: 200, description: 'Success'})
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPost(@Req() req){
    return this.postsService.getAllPost(req.user.id);
  }

  @Post('create')
  @ApiOperation({summary: 'Người dùng đăng bài'})
  @ApiResponse({status: 201, description: 'Success'})
  @ApiBody({type: PostDto})
  @ApiBearerAuth()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() body: PostDto, @Req() req){
    return this.postsService.createPost(req.user.id, body);
  }

  @Put('edit/:id')
  @ApiOperation({summary: 'Chỉnh sửa bài đăng'})
  @ApiResponse({status: 200, description: 'Success'})
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async editPost(@Param('id', ParseIntPipe) id: number, @Body() body: PostDto, @Req() req) {
    return this.postsService.updatePost(req.user.id,id, body);
  }


  @Post(':postId/post-save')
  @ApiOperation({summary: 'Lưu bài đăng'})
  @ApiResponse({status: 200})
  @ApiBearerAuth()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async savedPost(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.postsService.savePost(req.user.id, postId);
  }

  @Post(':postId/like')
  @ApiOperation({summary: 'Tim bài đăng'})
  @ApiResponse({status: 200})
  @ApiBearerAuth()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.postsService.likePost(req.user.id, postId);
  }

  @Get(':postId')
  @ApiOperation({summary: 'Xem bài đăng chi tiết'})
  @ApiResponse({status: 200})
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPostById(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.postsService.getPostById(req.user.id, postId);
  }

  @Delete('delete/:postId')
  @ApiOperation({summary: 'Xoá bài đăng'})
  @ApiResponse({status: 200})
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.postsService.deletePost(req.user.id, postId);
  }
}
