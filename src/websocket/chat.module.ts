import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileuploadController } from '../fileupload/fileupload.controller';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { TempMessage } from './entities/temp/temp.message.entity';
import { TempRoom } from './entities/temp/temp.room.entity';
import { TempUser } from './entities/temp/temp.user.entity';
import { RoomsService } from './rooms.service';
import { TempChatService } from './temp.chat.service';
import { TempRoomsService } from './temp.room.service';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Room]),
    SequelizeModule.forFeature([Message]),
    SequelizeModule.forFeature([TempRoom]),
    SequelizeModule.forFeature([TempMessage]),
    SequelizeModule.forFeature([TempUser]),
  ],
  providers: [
    WebsocketService,
    RoomsService,
    TempRoomsService,
    ChatService,
    TempChatService,
    FileuploadController,
  ],
  exports: [ChatService, RoomsService, TempChatService, TempRoomsService],
})
export class ChatModule {}
