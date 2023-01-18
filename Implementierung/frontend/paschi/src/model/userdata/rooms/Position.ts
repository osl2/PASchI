import {User} from "@/model/User";

export class Position {

  id: string;
  user: User;
  xCoordinate: number;
  yCoordinate: number;
  orientation: number;

  constructor(id: string, user: User, xCoordinate: number, yCoordinate: number, orientation: number) {
    this.id = id;
    this.user = user;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.orientation = orientation;
  }
}
