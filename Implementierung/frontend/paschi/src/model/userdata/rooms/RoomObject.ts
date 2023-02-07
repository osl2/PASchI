import {Position} from "@/model/userdata/rooms/Position";
import {User} from "@/model/User";
import {Dimensions} from "@/model/userdata/rooms/Dimensions";
import {DataObject} from "@/model/DataObject";

export abstract class RoomObject extends DataObject {

  private readonly _user: User;
  private _position: Position;
  private _dimensions: Dimensions;

  protected constructor(id: string | undefined, localId: number, user: User, position: Position,
                        dimensions: Dimensions) {
    super(id, localId);
    this._user = user;
    this._position = position;
    this._dimensions = dimensions;
  }

  get user(): User {
    return this._user;
  }

  get position(): Position {
    return this._position;
  }

  get dimensions(): Dimensions {
    return this._dimensions;
  }

  set position(value: Position) {
    this._position = value;
    this.update();
  }

  set dimensions(value: Dimensions) {
    this._dimensions = value;
    this.update();
  }
}
