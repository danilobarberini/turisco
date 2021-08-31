import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { TempRoom } from './temp.room.entity';

@Table
export class TempMessage extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => TempRoom)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roomId: string;

  @BelongsTo(() => TempRoom, 'roomId')
  room: TempRoom;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  author: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(500),
  })
  content: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(500),
  })
  picture?: string;
}
