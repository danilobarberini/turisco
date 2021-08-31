import { Exclude } from 'class-transformer';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryPoi } from 'src/categoryPoi/entities/categoryPoi.entity';
import { Comment } from 'src/comments/entities/comments.entity';
import { Favorite } from 'src/users/entities/favorites.entity';

@Table
export class POI extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  id: string;

  @ForeignKey(() => Agency)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  agencyId: string;

  @BelongsTo(() => Agency, 'agencyId')
  agency: Agency;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  description: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  address: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(8, 6),
  })
  lat: number;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(9, 6),
  })
  lng: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  views: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    defaultValue: '',
  })
  picture: string;

  @HasMany(() => Comment, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @HasMany(() => Favorite, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  favorite: Favorite;

  @BelongsToMany(() => Category, () => CategoryPoi)
  categories: Array<Category>;
}
