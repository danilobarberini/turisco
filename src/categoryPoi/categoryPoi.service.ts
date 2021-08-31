import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PoiService } from 'src/poi/poi.service';
import { UpdateCategoryPoiDTO } from './dto/update-categoryPoi.dto';
import { CategoryPoi } from './entities/categoryPoi.entity';
const { Sequelize } = require('sequelize');

@Injectable()
export class CategoryPoiService {
  constructor(
    @Inject(forwardRef(() => PoiService))
    private poiService: PoiService,
    @InjectModel(CategoryPoi)
    private categoryPoiEntity: typeof CategoryPoi,
  ) {}

  async findAll(poiId: string): Promise<CategoryPoi[]> {
    return this.categoryPoiEntity.findAll({
      where: {
        poiId: poiId,
      },
    });
  }

  async update(dto: UpdateCategoryPoiDTO) {
    return this.categoryPoiEntity.update(dto, {
      where: {
        poiId: dto.poiId,
      },
    });
  }

  async count(poiId: string, category_id: number) {
    const catPoi = await this.categoryPoiEntity.count({
      where: {
        poiId,
        category_id,
      },
    });

    return catPoi;
  }

  async delete(poiId: string, category_id: number[]) {
    const catPoi = await this.categoryPoiEntity.findAll({
      where: {
        poiId,
        category_id: { [Sequelize.Op.notIn]: category_id },
      },
    });

    catPoi.forEach((cat) => {
      cat.destroy();
    });

    return catPoi;
  }
}
