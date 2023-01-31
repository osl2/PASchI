import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class TableDto extends RoomObjectDto {

  length: number;
  width: number;

  constructor(id: string, userId: string, position: PositionDto, length: number, width: number) {
    super(id, userId, position);
    this.length = length;
    this.width = width;
  }
}
