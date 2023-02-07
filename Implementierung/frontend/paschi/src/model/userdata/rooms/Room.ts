import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {DataObject} from "@/model/DataObject";

export class Room extends DataObject {

  user: User;
  name: string;
  roomObjects: RoomObject[];

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    super(id, localId);
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

  getRoomObject(objectId: string): RoomObject | undefined {
    this.roomObjects.forEach((element: RoomObject) => {
      if (element.getId === objectId) {
        return element;
      }
    });

    return undefined;
  }
}
