import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {DataObject} from "@/model/DataObject";

export class Room extends DataObject {

  private readonly _user: User;
  private _name: string;
  private readonly _roomObjects: RoomObject[];

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    super(id, localId);
    this._user = user;
    this._name = name;
    this._roomObjects = [];
  }

  addRoomObject(object: RoomObject) {
    this._roomObjects.push(object);
    this.update();
  }

  removeRoomObject(objectId: string) {
    this._roomObjects.forEach((element, index) => {
      if (element.getId == objectId) {
        this._roomObjects.splice(index, 1);
      }
    });
    this.update();
  }

  getRoomObject(objectId: string): RoomObject | undefined {
    this._roomObjects.forEach((element: RoomObject) => {
      if (element.getId === objectId) {
        return element;
      }
    });

    return undefined;
  }

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  get roomObjects(): RoomObject[] {
    return this._roomObjects;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }
}
