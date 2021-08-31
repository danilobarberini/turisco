import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AgenciesService } from 'src/agencies/agencies.service';
import { AuthService } from 'src/auth/auth.service';
import { CategoryService } from 'src/categories/category.service';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryPoiService } from 'src/categoryPoi/categoryPoi.service';
import { CategoryPoi } from 'src/categoryPoi/entities/categoryPoi.entity';
import { CreatePoiDto } from './dto/create-poi.dto';
import { PaginatedPoiResultDto } from './dto/paginatedPoiResult.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { POI } from './entities/poi.entity';
const { Sequelize } = require('sequelize');

@Injectable()
export class PoiService {
  constructor(
    @Inject(forwardRef(() => AgenciesService))
    private readonly agencies: AgenciesService,
    @InjectModel(POI)
    private readonly poiEntity: typeof POI,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => CategoryPoiService))
    private categoryPoiService: CategoryPoiService,
  ) {}

  async create(authorization: string, dto: CreatePoiDto) {
    try {
      const poi = new POI();
      const verifyToken = this.authService.verify(authorization);

      if (!verifyToken) {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }

      const agency = await this.agencies.findOne((await verifyToken).id);
      poi.agencyId = agency.id;

      poi.name = dto.name;
      poi.description = dto.description;
      poi.address = dto.address;
      poi.lat = dto.lat;
      poi.lng = dto.lng;

      const poiData = await poi.save();
      const categoryData = [];

      for (let i = 0; i < dto.categories.length; i++) {
        const category = await this.categoryService.findName(dto.categories[i]);

        if (!category) {
          throw new HttpException(
            'category does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
        const catPoi = new CategoryPoi();
        catPoi.category_id = category.id;
        catPoi.poiId = poi.getDataValue('id');
        const catPoiData = await catPoi.save();
        categoryData.push(catPoiData);
      }

      const category = categoryData.map((cat) => {
        return cat.category_id;
      });

      const data = {
        poiData,
        category,
      };

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByAgency(agencyId: string) {
    const agency = await this.poiEntity.findAll({
      include: [Category],
      where: { agencyId },
    });
    if (!agency) {
      throw new HttpException('Agency does not exist', HttpStatus.BAD_REQUEST);
    }

    return agency;
  }

  async findAll(dto: PaginationDto): Promise<PaginatedPoiResultDto> {
    try {
      const skippedItems = (dto.page - 1) * 5;
      const totalCount = await this.poiEntity.count();
      const poi = await this.poiEntity.findAll({
        include: {
          model: Category,
          attributes: ['id', 'name'],
          through: {
            attributes: ['category_id'],
          },
        },
        offset: skippedItems,
        limit: 5,
      });
      return {
        totalCount,
        page: dto.page,
        data: poi,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findFavorite(poiId: string) {
    const fav = await this.poiEntity.findOne({
      where: { id: poiId },
    });
    return fav;
  }

  async findByCategory(name: string) {
    const category = await this.categoryService.filterByCategory(name);
    if (!category) {
      throw new HttpException(
        'category does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }

  async search(name?: string, address?: string) {
    if (name) {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          name: { [Sequelize.Op.like]: `%${name}%` },
        },
      });
    } else if (address) {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          address: { [Sequelize.Op.like]: `%${address}%` },
        },
      });
    } else {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          name: { [Sequelize.Op.like]: `%${name}%` },
          address: { [Sequelize.Op.like]: `%${address}%` },
        },
      });
    }
  }

  async filterByAgency(agencyId: string, name?: string, address?: string) {
    if (name) {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          agencyId,
          name: { [Sequelize.Op.like]: `%${name}%` },
        },
      });
    } else if (address) {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          agencyId,
          address: { [Sequelize.Op.like]: `%${address}%` },
        },
      });
    } else {
      return await this.poiEntity.findAll({
        include: [Category],
        where: {
          agencyId,
          name: { [Sequelize.Op.like]: `%${name}%` },
          address: { [Sequelize.Op.like]: `%${address}%` },
        },
      });
    }
  }

  async findOne(id: string) {
    const poi = await this.poiEntity.findByPk(id, { include: [Category] });
    if (!poi) {
      throw new HttpException(
        'tourist spot does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return poi;
  }

  async update(id: string, dto: UpdatePoiDto) {
    try {
      const poi = await this.poiEntity.findByPk(id);
      poi.name = dto.name;
      poi.description = dto.description;
      poi.address = dto.address;
      poi.lat = dto.lat;
      poi.lng = dto.lng;

      let categoryData = [];
      let categoriesIds = [];

      for (let i = 0; i < dto.categories.length; i++) {
        const category = await this.categoryService.findName(dto.categories[i]);
        if (!category) {
          throw new HttpException(
            'category does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }

        categoriesIds.push(category.id);

        const catPoi = await this.categoryPoiService.count(poi.id, category.id);
        if (catPoi > 0) {
          continue;
        }
        const cat = new CategoryPoi();
        cat.category_id = category.id;
        cat.poiId = poi.getDataValue('id');
        const catPoiData = await cat.save();
        categoryData.push(catPoiData);
      }

      await this.categoryPoiService.delete(poi.id, categoriesIds);

      const category = categoriesIds.map((cat) => {
        return cat.name;
      });

      poi.categories = category;

      await poi.save();

      const data = {
        poi,
        category,
      };

      return {
        message: 'updated successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string) {
    try {
      const poi = await this.findOne(id);
      if (!poi) {
        throw new HttpException(
          'tourist spot does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      await poi.destroy();

      return { message: 'successfully deleted' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async upload(id: string, url: string) {
    const poi = await this.poiEntity.findByPk(id);
    poi.picture = url;
    poi.save();
    return poi;
  }

  async addView(id: string) {
    const poi = await this.poiEntity.findByPk(id);
    poi.views = poi.views + 1;
    poi.save();
    return poi.views;
  }

  async getTopPois(limit: number) {
    const topPois = await this.poiEntity.findAll({
      include: [Category],
      order: [['views', 'DESC']],
      limit: limit,
    });
    return topPois;
  }
}
