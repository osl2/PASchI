import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";

export class RoomDto {

  id: string;
  userId: string;
  name: string;
  roomObjects: RoomObjectDto[];

  constructor(id: string, userId: string, name: string, roomObjects: RoomObjectDto[]) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.roomObjects = roomObjects;
  }
}
