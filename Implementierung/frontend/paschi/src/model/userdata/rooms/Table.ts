import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { User } from "@/model/User";
import { Position } from "@/model/userdata/rooms/Position";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export class Table extends RoomObject {

  length: number;
  width: number;

  constructor(id: string | undefined, localId: number, user: User, position: Position, length: number, width: number,
              dimension: Dimensions) {
    super(id, localId, user, position, dimension);
    this.length = length;
    this.width = width;
  }
}
