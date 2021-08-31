import { SequelizeModule } from '@nestjs/sequelize';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { forwardRef, Module } from '@nestjs/common';
import { Comment } from './entities/comments.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Comment]),
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [
        CommentController,
    ],
    providers: [
        CommentService,
    ],
    exports: [CommentService],
})
export class CommentModule { }
