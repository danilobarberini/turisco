import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Room } from './room.entity';

@Table
export class Message extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Room)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  roomId: string;

  @BelongsTo(() => Room, 'roomId')
  room: Room;

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
