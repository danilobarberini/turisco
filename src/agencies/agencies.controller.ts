import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { LoginAgencyDto } from './dto/login-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './entities/agency.entity';

@ApiTags('agencies')
@Controller('agencies')
export class AgenciesController {
  constructor(
    private readonly agenciesService: AgenciesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createAgencyDto: CreateAgencyDto) {
    const agency = await this.agenciesService.create(createAgencyDto);
    const { id, name, cnpj, email, createdAt, updatedAt } = agency;
    return { id, name, cnpj, email, createdAt, updatedAt };
  }

  @Post('/login')
  async login(@Body() loginAgencyDTO: LoginAgencyDto) {
    const agency = await this.authService.login(
      loginAgencyDTO.email,
      loginAgencyDTO.password,
    );
    return agency;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload')
  async upload(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: string,
  ) {
    const agency = await this.agenciesService.upload(id, file.location);
    const { name, email, picture, createdAt, updatedAt } = agency;
    return {
      message: 'File was succesfully uploaded!',
      url: `${file.location}`,
      agency: {
        id,
        name,
        email,
        picture,
        createdAt,
        updatedAt,
      },
    };
  }

  @Get('findEmail/:email')
  findMail(@Param('email') email: string) {
    return this.agenciesService.getByEmail(email);
  }

  @Post('/resetpassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.agenciesService.newPassword(
      token,
      updateAgencyDto,
    );
    const { id, name, cnpj, email, createdAt, updatedAt } = agency;
    return { id, name, cnpj, email, createdAt, updatedAt };
  }

  @Get()
  findAll() {
    return this.agenciesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Agency> {
    return await this.agenciesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    await this.agenciesService.update(id, updateAgencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
