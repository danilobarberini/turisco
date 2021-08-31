import {
  Column,
  DataType,
  HasMany,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Agency } from 'src/agencies/entities/agency.entity';
import { TempMessage } from './temp.message.entity';
import { TempUser } from './temp.user.entity';

@Table
export class TempRoom extends Model {
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

  @ForeignKey(() => TempUser)
  @Column({
    allowNull: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userId: string;

  @BelongsTo(() => TempUser, 'userId')
  user: TempUser;

  @HasMany(() => TempMessage)
  messages?: TempMessage;
}
