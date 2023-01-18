import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";

export class Room {

  id: number;
  user: User;
  name: string;
  roomObjects: RoomObject[];

  constructor(id: number, user: User, name: string) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.roomObjects = [];
  }

  addRoomObject(object: RoomObject): void {
    this.roomObjects.push(object);
  }

  removeRoomObject(objectId: number): void {
    this.roomObjects.forEach((element, index) => {
      if (element.id == objectId) {
        this.roomObjects.splice(index, 1);
      }
    });
  }
}
