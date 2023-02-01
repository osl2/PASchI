import {Position} from "@/model/userdata/rooms/Position";
import {User} from "@/model/User";
import {Dimensions} from "@/model/userdata/rooms/Dimensions";

export abstract class RoomObject {
  private id: string | undefined;
  private localId: number;
  user: User;
  position: Position;

  dimensions: Dimensions;

  protected constructor(id: string | undefined, localId: number, user: User, position: Position,
                        dimensions: Dimensions) {
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
