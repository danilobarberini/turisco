import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message)
    private messageEntity: typeof Message,
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
}
