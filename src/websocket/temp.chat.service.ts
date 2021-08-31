import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMessageDto } from './dto/create-message.dto';
import { TempMessage } from './entities/temp/temp.message.entity';

@Injectable()
export class TempChatService {
  constructor(
    @InjectModel(TempMessage)
    private messageEntity: typeof TempMessage,
  ) {}

  async saveMessage(createMessageDto: CreateMessageDto) {
    const message = await this.messageEntity.create(createMessageDto);
    return message;
  }

  async fetchAllByRoom(roomId: string) {
    const allMessages = await this.messageEntity.findAll({
      where: { roomId: roomId },
      order: [['createdAt', 'ASC']],
    });
    return allMessages;
  }

  async deleteAllMessages(roomId: string) {
    await this.messageEntity.destroy({ where: { roomId: roomId } });
    return 'Temporary messages deleted.';
  }
}
