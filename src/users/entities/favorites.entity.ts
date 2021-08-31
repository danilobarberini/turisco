import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { POI } from 'src/poi/entities/poi.entity';
import { User } from 'src/users/entities/user.entity';

@Table
export class Favorite extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => POI)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  poiId: string;

  @BelongsTo(() => POI, 'poiId')
  poi: POI;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
