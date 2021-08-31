import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from 'src/auth/auth.service';
import { POI } from 'src/poi/entities/poi.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateStatusCommentDto } from './dto/update-status-comment.dto';
import { Comment } from './entities/comments.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private readonly commentEntity: typeof Comment,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(authorization: string, dto: CreateCommentDto, poiId: string) {
    const comment = new Comment();
    comment.poiId = poiId;
    comment.comment = dto.comment;

    const verifyToken = await this.authService.verify(authorization);

    if (!verifyToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne(verifyToken.id);
    comment.userId = user.id;

    await comment.save();

    return comment;
  }

  async findAll(): Promise<Comment[]> {
    const comment = await this.commentEntity.findAll({ include: [POI] });

    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.BAD_REQUEST);
    }
    return comment;
  }

  async findAllWithTrueStatusBypoiId(poiId: string): Promise<Comment[]> {
    const comment = await this.commentEntity.findAll({
      include: {
        model: User,
        attributes: ['username', 'picture', 'createdAt'],
      },
      where: {
        poiId,
        status: true,
      },
    });

    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.BAD_REQUEST);
    }

    return comment;
  }

  async findAllWithFalseStatusBypoiId(poiId: string): Promise<Comment[]> {
    const comment = await this.commentEntity.findAll({
      include: {
        model: User,
        attributes: ['username', 'picture', 'createdAt'],
      },
      where: {
        poiId,
        status: false,
      },
    });
    return comment;
  }

  async findAllAgencyWithTrueStatus(poiId: string): Promise<Comment[]> {
    const comment = await this.commentEntity.findAll({
      include: [POI],
      where: {
        poiId,
        status: true,
      },
    });

    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.BAD_REQUEST);
    }

    return comment;
  }

  async updateStatus(id: string, dto: UpdateStatusCommentDto) {
    await this.commentEntity.update(dto, {
      where: {
        id,
      },
    });

    const comment = await this.commentEntity.findByPk(id);

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto) {
    await this.commentEntity.update(dto, {
      where: {
        id,
      },
    });

    const comment = await this.commentEntity.findByPk(id);

    return comment;
  }

  async delete(id: string) {
    const comment = await this.commentEntity.findByPk(id);

    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.BAD_REQUEST);
    }

    await comment.destroy();

    return { message: 'successfully deleted' };
  }
}
