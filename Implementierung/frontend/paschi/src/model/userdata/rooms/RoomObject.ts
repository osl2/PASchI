import { Position } from "@/model/userdata/rooms/Position";
import { User } from "@/model/User";
import { ref } from "vue";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export abstract class RoomObject {
  room = ref;

  id: string;
  user: User;
  position: Position;
  dimensions: Dimensions;

  protected constructor(
    id: string,
    user: User,
    position: Position,
    dimensions: Dimensions
  ) {
    this.id = id;
    this.user = user;
    this.position = position;
    this.dimensions = dimensions;
  }
}
