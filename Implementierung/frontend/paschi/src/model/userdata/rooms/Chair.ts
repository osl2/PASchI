import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { User } from "@/model/User";
import { Position } from "@/model/userdata/rooms/Position";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export class Chair extends RoomObject {

  constructor(id: string | undefined, localId: number, user: User, position: Position) {
    super(id, localId, user, position, new Dimensions(500, 500));
  }

  // copy(): RoomObject {
  //   return new Chair(undefined, 0, this.user, this.position.copy());
  // }

  isTable(): boolean {
    return false;
  }
}
