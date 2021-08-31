import { Model, Table, DataType, Column, HasMany } from 'sequelize-typescript';
import { POI } from 'src/poi/entities/poi.entity';
import { Room } from 'src/websocket/entities/room.entity';

@Table
export class Agency extends Model {
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
    unique: true,
  })
  cnpj: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
    defaultValue: '',
  })
  picture: string;

  @HasMany(() => POI, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  poi: POI[];

  @HasMany(() => Room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  rooms: Room;
}
