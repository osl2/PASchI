import { User } from "@/model/User";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";

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
    this.roomObjects.push(object);
  }

  removeRoomObject(objectId: string) {
    this.roomObjects.forEach((element, index) => {
      if (element.getId == objectId) {
        this.roomObjects.splice(index, 1);
      }
    });
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
