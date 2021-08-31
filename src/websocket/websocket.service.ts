import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateTempUserDto } from './dto/create-temp-user.dto';
import { TempRoomJoinDTO } from './dto/join-temp-room.dto';
import { RoomsService } from './rooms.service';
import { TempChatService } from './temp.chat.service';
import { TempRoomsService } from './temp.room.service';

@WebSocketGateway({ allowUpgrades: false })
export class WebsocketService implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly roomsService: RoomsService,

    private readonly tempChatService: TempChatService,
    private readonly tempRoomsService: TempRoomsService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`User ${client.id} has connected.`);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto,
  ) {
    const room = await this.roomsService.joinRoom(createRoomDto);

    if (!client.rooms.has(room.id)) {
      client.join(room.id);
    } else {
      console.log(client.rooms);
    }
    const allMessages = await this.chatService.fetchAllByRoom(room.id);
    this.server
      .to(client.id)
      .emit('joined_room', { roomId: room.id, messages: allMessages });
  }

  @SubscribeMessage('__temp_join')
  async joinTempRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() tempRoomJoinDTO: TempRoomJoinDTO,
  ) {
    const createTempUserDto: CreateTempUserDto = {
      name: tempRoomJoinDTO.name,
      phone: tempRoomJoinDTO.phone,
      email: tempRoomJoinDTO.email,
    };
    const tempUser = await this.tempRoomsService.createTempUser(
      createTempUserDto,
    );

    const room = await this.tempRoomsService.joinRoom({
      agencyId: tempRoomJoinDTO.agencyId,
      userId: tempUser.id,
    });

    if (!client.rooms.has(room.id)) {
      client.join(room.id);
    } else {
      console.log(client.rooms);
    }
    const allMessages = await this.tempChatService.fetchAllByRoom(room.id);
    this.server
      .to(client.id)
      .emit('joined_room', { roomId: room.id, messages: allMessages });
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    const newMessage = await this.chatService.saveMessage(createMessageDto);

    this.server
      .to(createMessageDto.roomId)
      .emit('received_message', newMessage);
  }

  @SubscribeMessage('__temp_send_message')
  async sendTempMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    const newMessage = await this.tempChatService.saveMessage(createMessageDto);

    this.server
      .to(createMessageDto.roomId)
      .emit('received_message', newMessage);
  }

  @SubscribeMessage('find_rooms')
  async sendRooms(
    @ConnectedSocket() client: Socket,
    @MessageBody() agencyId: string,
  ) {
    const rooms = await this.roomsService.findRooms(agencyId);
    const tempRooms = await this.tempRoomsService.findRooms(agencyId);
    tempRooms !== null
      ? this.server.to(client.id).emit('all_rooms', { rooms, tempRooms })
      : this.server.to(client.id).emit('all_rooms', rooms);
  }

  @SubscribeMessage('__temp_cleanup')
  async cleanupRooms(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const tempmessages = await this.tempChatService.deleteAllMessages(roomId);
    const cleanup = await this.tempRoomsService.cleanup(roomId);

    this.server
      .to(client.id)
      .emit('__cleanup_complete', { tempmessages, cleanup });
  }
}
