import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateTempUserDto } from './dto/create-temp-user.dto';
import { TempRoom } from './entities/temp/temp.room.entity';
import { TempUser } from './entities/temp/temp.user.entity';

@Injectable()
export class TempRoomsService {
  constructor(
    @InjectModel(TempRoom)
    private roomEntity: typeof TempRoom,
    @InjectModel(TempUser)
    private userEntity: typeof TempUser,
  ) {}

  async createTempUser(createTempUserDto: CreateTempUserDto) {
    const tempUser = await this.userEntity.create(createTempUserDto);
    return tempUser;
  }

  async joinRoom(createRoomDto: CreateRoomDto) {
    const { agencyId, userId } = createRoomDto;
    const [room] = await this.roomEntity.findOrCreate({
      include: [TempUser],
      where: { agencyId, userId },
      defaults: {
        agencyId,
        userId,
      },
    });
    return room;
  }

  async findRooms(agencyId: string) {
    const rooms = await this.roomEntity.findAll({
      include: [TempUser],
      where: { agencyId },
    });
    return rooms;
  }

  async cleanup(roomId: string) {
    const room = await this.roomEntity.findByPk(roomId);
    const { id } = await this.userEntity.findByPk(room.userId);

    await this.roomEntity.destroy({ where: { id: roomId } });
    await this.userEntity.destroy({ where: { id } });
    return 'Temporary user and room deleted.';
  }
}
