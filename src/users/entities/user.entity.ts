import { Comment } from 'src/comments/entities/comments.entity';
import {
  DataType,
  Model,
  Table,
  Column,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Room } from 'src/websocket/entities/room.entity';
import { POI } from 'src/poi/entities/poi.entity';
import { Favorite } from './favorites.entity';

@Table
export class User extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(60),
  })
  email: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(60),
  })
  username: string;

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

  @HasMany(() => Room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  rooms: Room;
}
