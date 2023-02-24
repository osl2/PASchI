import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class TableDto extends RoomObjectDto {

  length: number;
  width: number;
  private readonly type = 'table';

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, position: PositionDto, length: number,
              width: number) {
    super(id, userId, createdAt, updatedAt, position);
    this.length = length;
    this.width = width;
  }
}
