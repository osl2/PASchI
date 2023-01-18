import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {User} from "@/model/User";
import {Position} from "@/model/userdata/rooms/Position";

export class Chair extends RoomObject {

  constructor(id: string, user: User, position: Position) {
    super(id, user, position);
  }
}
