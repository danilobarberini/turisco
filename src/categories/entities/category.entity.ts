import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { POI } from 'src/poi/entities/poi.entity';
import { CategoryPoi } from '../../categoryPoi/entities/categoryPoi.entity';

@Table
export class Category extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
    onUpdate: 'cascade',
    onDelete: 'cascade'
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => POI, () => CategoryPoi)
  pois: Array<POI & { CategoryPoi: CategoryPoi }>;
}
