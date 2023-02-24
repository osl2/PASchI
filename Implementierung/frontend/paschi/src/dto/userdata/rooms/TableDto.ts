import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

const type = 'table';

export class TableDto extends RoomObjectDto {

  length: number;
  width: number;
  readonly type = 'table';

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto, length: number,
              width: number) {
    super(id, userId, createdAt, updatedAt, position, type);
    this.length = length;
    this.width = width;
  }
}
