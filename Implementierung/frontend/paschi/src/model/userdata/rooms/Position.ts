import {User} from "@/model/User";

export class Position {

  private id: string | undefined;
  private localId: number;
  user: User;
  xCoordinate: number;
  yCoordinate: number;
  orientation: number;

  constructor(id: string | undefined, localId: number, user: User, xCoordinate: number, yCoordinate: number,
              orientation: number) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.orientation = orientation;
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
