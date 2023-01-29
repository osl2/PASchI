import { Position } from "@/model/userdata/rooms/Position";
import { User } from "@/model/User";
import { ref } from "vue";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export abstract class RoomObject {
  room = ref;

  private id: string | undefined;
  private localId: number;
  user: User;
  position: Position;
  dimensions: Dimensions;

  protected constructor(id: string | undefined, localId: number, user: User, position: Position) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.position = position;
    this.dimensions = dimensions;
  }

  get getId(): string {
    if (this.id == undefined) {
      return this.localId.toString();
    }
    return this.id;
  }

  set setId(id: string) {
    this.id = id;
  }
}
