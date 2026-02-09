import { Body, Controller, HttpCode, Param, ParseIntPipe, Post, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateComment } from './dtos/create-comment.dto';
import { CommentGateway } from './comment.gateway';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentGateWay: CommentGateway
  ) {}
  @Get(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Lấy comment thành công'})
  @ApiOperation({summary: 'Lấy tất cả comment trong theo postId'})
  @HttpCode(200)
  async getComment(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.commentsService.getCommentByPostID(req.user.id, postId);
  }

  // @Post('/:postId')
  // @ApiOperation({summary: 'Bình luận bài viết'})
  // @ApiResponse({status: 201})
  // @HttpCode(201)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async createComment(@Param('postId', ParseIntPipe) postId: number, @Body() body: CreateComment, @Req() req){
  //   console.log(`Post-id: ${postId}`);
  //   const comments = await this.commentsService.createComment(postId, req.user.id, body);
  //   console.log("comment:", comments);
  //   this.commentGateWay.emitSendMessage(postId, comments);
  //   return comments;
  // }

  @Delete('/:postId/:commentId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Xoá bình luận theo commentId trong post'})
  @ApiResponse({status: 200, description: 'Xoá bình luận thành công'})
  async deleteComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req
  ){
    const result = await this.commentsService.deleteComment(commentId, req.user.id, postId);
    this.commentGateWay.emitDeleteMessage(postId, commentId);
    return result;
  }
}
