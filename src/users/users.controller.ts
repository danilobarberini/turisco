import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RemoveFavoriteDto } from './dto/remove-favorite.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: [CreateUserDto] })
  @ApiCreatedResponse({ status: 201, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { id, username, email, picture, createdAt, updatedAt } = user;
    return { id, username, email, picture, createdAt, updatedAt };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorites/:id')
  async getFavorites(@Param('id') id: string) {
    const favorites = await this.usersService.getFavorites(id);
    return favorites;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/favorites/')
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    const favorites = await this.usersService.addFavorite(createFavoriteDto);
    return favorites;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/favorites/')
  async deleteFavorite(@Body() removeFavoriteDto: RemoveFavoriteDto) {
    const updatedUser = await this.usersService.removeFavorite(
      removeFavoriteDto,
    );
    return updatedUser;
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.login(
      loginUserDto.email,
      loginUserDto.password,
    );

    return user;
  }

  @Post('/loginGoogle')
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    const logged = await this.authService.loginGoogle(loginGoogleDto);
    return logged;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload')
  async upload(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.upload(id, file.location);
    const { username, email, picture, createdAt, updatedAt } = user;
    return {
      message: 'File was succesfully uploaded!',
      url: `${file.location}`,
      user: {
        id,
        username,
        email,
        picture,
        createdAt,
        updatedAt,
      },
    };
  }

  @Post('/forgotpassword/:email')
  async forgotPassword(@Param('email') email: string) {
    await this.usersService.sendMail(email);
    return `Email sent to ${email} !`;
  }

  @Post('/resetpassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const newUser = await this.usersService.newPassword(token, updateUserDto);
    const { id, username, email, createdAt, updatedAt } = newUser;
    return { id, username, email, createdAt, updatedAt };
  }

  @Get('/findEmail/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    const { id, username, createdAt, updatedAt } = user;
    return { id, username, email, createdAt, updatedAt };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const { username, email, picture, createdAt, updatedAt } = user;
    return { id, username, email, picture, createdAt, updatedAt };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
