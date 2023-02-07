import {Position} from "@/model/userdata/rooms/Position";
import {User} from "@/model/User";
import {Dimensions} from "@/model/userdata/rooms/Dimensions";
import {DataObject} from "@/model/DataObject";

export abstract class RoomObject extends DataObject {

  user: User;
  position: Position;
  dimensions: Dimensions;

  protected constructor(id: string | undefined, localId: number, user: User, position: Position,
                        dimensions: Dimensions) {
    super(id, localId);
    this.user = user;
    this.position = position;
    this.dimensions = dimensions;
  }
}
