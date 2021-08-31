import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room)
    private roomEntity: typeof Room,
  ) {}

  async joinRoom(createRoomDto: CreateRoomDto) {
    const { agencyId, userId } = createRoomDto;
    const [room] = await this.roomEntity.findOrCreate({
      include: [User],
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
      include: [User],
      where: { agencyId },
    });
    return rooms;
  }
}
