import { Controller, Get, Param } from '@nestjs/common';
import { CategoryPoiService } from './categoryPoi.service';

@Controller('categoryPoi')
export class CategoryPoiController {
  constructor(private readonly categoryService: CategoryPoiService) {}

  @Get(':poiId')
  async findAll(@Param('poiId') poiId: string) {
    return await this.categoryService.findAll(poiId);
  }
}
