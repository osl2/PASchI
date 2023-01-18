import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {User} from "@/model/User";
import {Position} from "@/model/userdata/rooms/Position";

export class Table extends RoomObject {

  length: number;
  width: number;

  constructor(id: string, user: User, position: Position, length: number, width: number) {
    super(id, user, position);
    this.length = length;
    this.width = width;
  }
}
