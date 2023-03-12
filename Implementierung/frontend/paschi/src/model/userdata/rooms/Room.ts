import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {DataObject} from "@/model/DataObject";

export class Room extends DataObject {

  private readonly _user: User;
  private _name: string;
  private _roomObjects: RoomObject[];
  private _visible: boolean = true;

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    super(id, localId);
    this._user = user;
    this._name = name;
    this._roomObjects = [];
  }

  addRoomObject(object: RoomObject) {
    if (this.getRoomObject(object.getId) == undefined) {
      this._roomObjects.push(object);
    }
    this.update();
  }

  removeRoomObject(objectId: string) {
    this.roomObjects.forEach((element: RoomObject, index: number) => {
      if (element.getId === objectId) {
        this._roomObjects.splice(index, 1);
      }
    });
    this.update();
  }

  getRoomObject(objectId: string): RoomObject | undefined {
    for (const object of this._roomObjects) {
      if (object.getId === objectId) {
        return object;
      }
    }
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

  get visible(): boolean {
    return this._visible;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  set roomObjects(value: RoomObject[]) {
    this._roomObjects = value;
  }

  set visible(value: boolean) {
    this._visible = value;
  }
}
