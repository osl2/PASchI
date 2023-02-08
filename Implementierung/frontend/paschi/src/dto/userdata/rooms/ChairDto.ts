import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class ChairDto extends RoomObjectDto {

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto) {
    super(id, userId, createdAt, updatedAt, position);
  }
}
