import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';
import { Message } from './message.entity';

@Table
export class Room extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Agency)
  @Column({
    allowNull: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  agencyId: string;

  @BelongsTo(() => Agency, 'agencyId')
  agency: Agency;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => Message)
  messages?: Message;
}
