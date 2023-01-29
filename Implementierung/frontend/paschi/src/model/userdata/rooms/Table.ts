import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { User } from "@/model/User";
import { Position } from "@/model/userdata/rooms/Position";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export class Table extends RoomObject {
  constructor(
    id: string,
    user: User,
    position: Position,
    dimensions: Dimensions
  ) {
    super(id, user, position, dimensions);
  }
}
