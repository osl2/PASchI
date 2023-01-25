import { Position } from "@/model/userdata/rooms/Position";
import { User } from "@/model/User";
import { ref } from "vue";

export abstract class RoomObject {
  room = ref;

  id: string;
  user: User;
  position: Position;

  protected constructor(id: string, user: User, position: Position) {
    this.id = id;
    this.user = user;
    this.position = position;
  }
}
