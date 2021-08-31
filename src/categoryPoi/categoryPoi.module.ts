import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PoiModule } from 'src/poi/poi.module';
import { CategoryPoiService } from '../categoryPoi/categoryPoi.service';
import { CategoryPoi } from '../categoryPoi/entities/categoryPoi.entity';
import { CategoryPoiController } from './categoryPoi..controller';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoryPoi]),
    forwardRef(() => PoiModule),
  ],
  controllers: [CategoryPoiController],
  providers: [CategoryPoiService],
  exports: [CategoryPoiService],
})
export class CategoryPoiModule {}
