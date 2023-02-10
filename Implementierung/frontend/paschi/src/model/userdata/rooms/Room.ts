import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";

export class Room {

  private id: string | undefined;
  private localId: number;
  user: User;
  name: string;
  roomObjects: RoomObject[];

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.name = name;
    this.roomObjects = [];
  }

  addRoomObject(object: RoomObject) {
    if (this.getRoomObject(object.getId) == undefined) {
      this.roomObjects.push(object);
    }
  }

  removeRoomObject(objectId: string) {
    this.roomObjects.forEach((element: RoomObject, index: number) => {
      if (element.getId == objectId) {
        this.roomObjects.splice(index, 1);
      }
    });
  }

  getRoomObject(objectId: string): RoomObject | undefined {
    for (let i = 0; i < this.roomObjects.length; i++) {
      if (this.roomObjects.at(i)?.getId === objectId) {
        return this.roomObjects.at(i);
      }
    }

    return undefined;
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

  copy(): Room {
    return new Room(undefined, 0, this.user, this.name);
  }
}
