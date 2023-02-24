import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

const type = 'chair';

export class ChairDto extends RoomObjectDto {

  readonly type = 'chair';

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto) {
    super(id, userId, createdAt, updatedAt, position, type);
  }
}
