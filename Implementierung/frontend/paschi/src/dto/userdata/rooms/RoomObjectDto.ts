import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class RoomObjectDto {

  id: string;
  userId: string;
  position: PositionDto;

  constructor(id: string, userId: string, position: PositionDto) {
    this.id = id;
    this.userId = userId;
    this.position = position;
  }
}
