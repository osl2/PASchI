import {Room} from "@/model/userdata/rooms/Room";
import {Position} from "@/model/userdata/rooms/Position";

export class RoomController {

  private static controller: RoomController = new RoomController();

  private constructor() {
  }

  static getRoomController(): RoomController {
    return RoomController.controller;
  }

  createRoom(name: string): number {
    return 0;
  }

  updateRoom(id: number) {

  }

  deleteRoom(id: number) {

  }

  getRoom(id: number): Room | undefined {
    return undefined;
  }

  getAllRooms(): Room[] {
    return [];
  }

  addChair(roomId: number, pos: Position): number {
    return 0;
  }

  addTable(roomId: number, pos: Position, length: number, width: number): number {
    return 0;
  }

  removeRoomObject(roomId: number, objectId: number) {

  }
}
