import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { POI } from 'src/poi/entities/poi.entity';
import { Category } from '../../categories/entities/category.entity';

@Table
export class CategoryPoi extends Model {
  @ForeignKey(() => POI)
  @Column
  poiId: string;

  @ForeignKey(() => Category)
  @Column
  category_id: number;
}
