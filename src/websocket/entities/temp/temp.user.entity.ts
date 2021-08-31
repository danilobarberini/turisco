import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TempRoom } from './temp.room.entity';

@Table
export class TempUser extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email: string;

  @HasMany(() => TempRoom, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  })
  rooms?: TempRoom;
}
