import {Room} from "@/model/userdata/rooms/Room";
import {Position} from "@/model/userdata/rooms/Position";
import {useRoomStore} from "@/store/RoomStore";
import {UserController} from "@/controller/UserController";
import {Chair} from "@/model/userdata/rooms/Chair";
import {useRoomObjectStore} from "@/store/RoomObjectStore";
import {Table} from "@/model/userdata/rooms/Table";

export class RoomController {

  private static controller: RoomController = new RoomController();
  private roomStore = useRoomStore();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getRoomController(): RoomController {
    return RoomController.controller;
  }

  createRoom(name: string): string {
    let room = new Room(undefined, this.roomStore.getNextId(), this.userController.getUser(), name);
    this.roomStore.addRoom(room);

    return room.getId;
  }

  updateRoom(id: string, name: string) {
    let room = this.roomStore.getRoom(id);
    if (room !== undefined) {
      room.name = name;
    }
  }

  deleteRoom(id: string) {
    this.roomStore.deleteRoom(id);
  }

  getRoom(id: string): Room | undefined {
    let room = this.roomStore.getRoom(id);
    if (room == undefined) {
      return undefined;
    }
    return room;
  }

  getAllRooms(): Room[] {
    return this.roomStore.getAllRooms();
  }

  addChair(roomId: string, pos: Position): string | undefined {
    let room = this.roomStore.getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    let chair = new Chair(undefined, useRoomObjectStore().getNextId(), this.userController.getUser(), pos);
    room.addRoomObject(chair);

    return chair.getId;
  }

  addTable(roomId: string, pos: Position, length: number, width: number): string | undefined {
    let room = this.roomStore.getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    let table = new Table(undefined, useRoomObjectStore().getNextId(), this.userController.getUser(), pos, length,
      width);
    room.addRoomObject(table);

    return table.getId;
  }

  removeRoomObject(roomId: string, objectId: string) {
    let room = this.roomStore.getRoom(roomId);
    if (room !== undefined) {
      room.removeRoomObject(objectId);
    }
  }
}
