import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class RoomObjectDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  position: PositionDto;
  readonly type;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto, type: string) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.position = position;
    this.type = type;
  }
}
