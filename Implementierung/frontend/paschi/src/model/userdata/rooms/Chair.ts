import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { User } from "@/model/User";
import { Position } from "@/model/userdata/rooms/Position";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export class Chair extends RoomObject {

  constructor(id: string | undefined, localId: number, user: User, position: Position, dimension: Dimensions) {
    super(id, localId, user, position, dimension);
  }
}
