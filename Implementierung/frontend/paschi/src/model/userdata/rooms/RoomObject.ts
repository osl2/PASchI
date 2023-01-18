import {Position} from "@/model/userdata/rooms/Position";
import {User} from "@/model/User";

export abstract class RoomObject {

  id: string;
  user: User;
  position: Position;

  protected constructor(id: string, user: User, position: Position) {
    this.id = id;
    this.user = user;
    this.position = position;
  }
}
