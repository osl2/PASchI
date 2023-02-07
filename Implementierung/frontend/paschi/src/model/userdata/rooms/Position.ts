import {User} from "@/model/User";
import {DataObject} from "@/model/DataObject";

export class Position extends DataObject {

  private readonly _user: User;
  private _xCoordinate: number;
  private _yCoordinate: number;
  private _orientation: number;

  constructor(id: string | undefined, localId: number, user: User, xCoordinate: number, yCoordinate: number, orientation: number) {
    super(id, localId);
    this._user = user;
    this._xCoordinate = xCoordinate;
    this._yCoordinate = yCoordinate;
    this._orientation = orientation;
  }

  get user(): User {
    return this._user;
  }

  get xCoordinate(): number {
    return this._xCoordinate;
  }

  get yCoordinate(): number {
    return this._yCoordinate;
  }

  get orientation(): number {
    return this._orientation;
  }

  set xCoordinate(value: number) {
    this._xCoordinate = value;
    this.update();
  }

  set yCoordinate(value: number) {
    this._yCoordinate = value;
    this.update();
  }

  set orientation(value: number) {
    this._orientation = value;
    this.update();
  }
}
