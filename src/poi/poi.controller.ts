import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { CreatePoiDto } from './dto/create-poi.dto';
import { PaginatedPoiResultDto } from './dto/paginatedPoiResult.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { POI } from './entities/poi.entity';
import { PoiService } from './poi.service';

@ApiTags('poi')
@Controller('poi')
export class PoiController {
  private readonly poiService: PoiService;

  constructor(poiService: PoiService) {
    this.poiService = poiService;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: [CreatePoiDto] })
  @ApiCreatedResponse({ status: 201, type: POI })
  @ApiResponse({ status: 400, description: 'pois.name must be unique.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() dto: CreatePoiDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.poiService.create(authorization, dto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload')
  async upload(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: string,
  ) {
    const poi = await this.poiService.upload(id, file.location);
    const {
      agencyId,
      name,
      description,
      address,
      picture,
      categories,
      createdAt,
      updatedAt,
    } = poi;
    return {
      message: 'File was succesfully uploaded!',
      url: `${file.location}`,
      POI: {
        id,
        agencyId,
        name,
        description,
        address,
        picture,
        categories,
        createdAt,
        updatedAt,
      },
    };
  }

  @Get()
  async findAll(@Query() dto: PaginationDto): Promise<PaginatedPoiResultDto> {
    dto.page = Number(dto.page);
    return this.poiService.findAll({
      ...dto,
    });
  }

  @Get('filterByAgency/:agencyId')
  async filterByAgency(
    @Param('agencyId') agencyId: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
  ) {
    return await this.poiService.filterByAgency(agencyId, name, address);
  }

  @Get('search')
  async search(
    @Query('name') name?: string,
    @Query('address') address?: string,
  ) {
    return await this.poiService.search(name, address);
  }

  @Get('findCategory/:name')
  async findName(@Param('name') name: string) {
    return await this.poiService.findByCategory(name);
  }

  @Get(':agencyId')
  async findAllByAgency(@Param('agencyId') agencyId: string) {
    return await this.poiService.findAllByAgency(agencyId);
  }

  @Get('findOne/:id')
  async findOne(@Param('id') id: string) {
    return await this.poiService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePoiDto) {
    return this.poiService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.poiService.delete(id);
  }

  @Post(':id')
  async addView(@Param('id') id: string) {
    const totalViews = await this.poiService.addView(id);
    return totalViews;
  }

  @Get('/top/:limit')
  async getTopPois(@Param('limit') limit: number) {
    const topPois = await this.poiService.getTopPois(limit);
    return topPois;
  }
}
