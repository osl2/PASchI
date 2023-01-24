import {Room} from "@/model/userdata/rooms/Room";
import {Position} from "@/model/userdata/rooms/Position";

export class RoomController {

  private static controller: RoomController = new RoomController();

  private constructor() {
  }

  static getRoomController(): RoomController {
    return RoomController.controller;
  }

  createRoom(name: string): string {
    return "";
  }

  updateRoom(id: string) {

  }

  deleteRoom(id: string) {

  }

  getRoom(id: string): Room | undefined {
    return undefined;
  }

  getAllRooms(): Room[] {
    return [];
  }

  addChair(roomId: string, pos: Position): string {
    return "";
  }

  addTable(roomId: string, pos: Position, length: number, width: number): string {
    return "";
  }

  removeRoomObject(roomId: string, objectId: string) {

  }
}
