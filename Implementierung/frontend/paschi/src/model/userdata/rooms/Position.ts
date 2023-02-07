import {User} from "@/model/User";
import {DataObject} from "@/model/DataObject";

export class Position extends DataObject {

  user: User;
  xCoordinate: number;
  yCoordinate: number;
  orientation: number;

  constructor(id: string | undefined, localId: number, user: User, xCoordinate: number, yCoordinate: number, orientation: number) {
    super(id, localId);
    this.user = user;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.orientation = orientation;
  }
}
