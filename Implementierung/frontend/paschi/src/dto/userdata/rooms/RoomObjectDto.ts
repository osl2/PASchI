import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class RoomObjectDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  position: PositionDto;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.position = position;
  }
}
