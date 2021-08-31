import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateStatusCommentDto } from './dto/update-status-comment.dto';

@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':poiId')
  async create(
    @Body() dto: CreateCommentDto,
    @Headers('authorization') authorization: string,
    @Param('poiId') poiId: string,
  ) {
    return await this.commentService.create(authorization, dto, poiId);
  }

  @Get()
  async findAll() {
    return await this.commentService.findAll();
  }

  @Get('findAllWithTrueStatusBypoiId/:poiId')
  async findAllAgencyWithTrueStatus(@Param('poiId') poiId: string) {
    return await this.commentService.findAllWithTrueStatusBypoiId(poiId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findAllWithFalseStatusBypoiId/:poiId')
  async findAllAgencyWithFalseStatus(@Param('poiId') poiId: string) {
    return await this.commentService.findAllWithFalseStatusBypoiId(poiId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusCommentDto,
  ) {
    return await this.commentService.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return await this.commentService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.commentService.delete(id);
  }
}
