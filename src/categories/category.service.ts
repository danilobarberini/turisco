import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { POI } from 'src/poi/entities/poi.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryEntity: typeof Category,
  ) { }

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      const cat = new Category();
      cat.name = dto.name.toLowerCase();

      const catData = cat.save();

      return catData;

    } catch (error) {
      throw new HttpException(error.errors[0].message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryEntity.findAll();
  }

  async findName(name: string) {
    return await this.categoryEntity.findOne({
      where: {
        name: name
      }
    })
  }

  async filterByCategory(name: string) {
    const category = await this.categoryEntity.findAll({ include: [POI], where: { name } });
    if (!category) {
      throw new HttpException('category does not exist', HttpStatus.BAD_REQUEST)
    }
    return category;
  }

  async findOne(id: number) {
    return await this.categoryEntity.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.categoryEntity.update(dto, {
      where: {
        id: id,
      },
    });

    return { message: 'category updated successfully.' };
  }

  async remove(id: number) {
    const agency = await this.findOne(id);
    await agency.destroy();

    return { message: 'category successfully deleted.' };
  }
}
