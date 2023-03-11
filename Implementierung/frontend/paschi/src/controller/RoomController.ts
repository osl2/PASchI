import {Room} from "@/model/userdata/rooms/Room";
import {Position} from "@/model/userdata/rooms/Position";
import {useRoomStore} from "@/store/RoomStore";
import {UserController} from "@/controller/UserController";
import {Chair} from "@/model/userdata/rooms/Chair";
import {useRoomObjectStore} from "@/store/RoomObjectStore";
import {Table} from "@/model/userdata/rooms/Table";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {usePositionStore} from "@/store/PositionStore";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {RoomService} from "@/service/RoomService";

export class RoomController {
  private static controller: RoomController = new RoomController();
  private roomService = RoomService.getService();

  private constructor() {
  }

  static getRoomController(): RoomController {
    return this.controller;
  }

  async createRoom(name: string): Promise<string> {
    const room = new Room(
      undefined,
      useRoomStore().getNextId(),
      UserController.getUserController().getUser(),
      name
    );

    await this.roomService.add(room);
    return useRoomStore().addRoom(room);
  }

  async createInvisibleRoom(name: string): Promise<string> {
    let room = new Room(
      undefined,
      useRoomStore().getNextId(),
      UserController.getUserController().getUser(),
      name
    );

    room.visible = false;
    await this.roomService.add(room);
    return useRoomStore().addRoom(room);
  }

  async saveRoom(id: string) {
    const room = useRoomStore().getRoom(id);
    if (room) {
      await this.roomService.update(room);
    }
  }

  async deleteRoom(id: string) {
    const arrangementController = SeatArrangementController.getSeatArrangementController();
    const room = useRoomStore().getRoom(id);
    if (room) {
      for (const arrangement of useSeatArrangementStore().getAllSeatArrangements()) {
        if (arrangement.room.getId === id) {
          await arrangementController.deleteSeatArrangement(arrangement.getId);
        }
      }
      for (const roomObject of room.roomObjects) {
        await this.removeRoomObject(id, roomObject.getId);
      }
      await this.roomService.delete(id);
      useRoomStore().deleteRoom(id);
    }
  }

  getRoom(id: string): Room | undefined {
    return useRoomStore().getRoom(id);
  }

  getAllRooms(): Room[] {
    this.roomService.getAll().then();
    return useRoomStore().getAllRooms().filter((room: Room) => room.visible);
  }

  addChair(roomId: string, xCoordinate: number, yCoordinate: number, orientation: number):
    string | undefined {

    const room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    const user = UserController.getUserController().getUser();
    const position = new Position(
      undefined,
      usePositionStore().nextId,
      user,
      xCoordinate,
      yCoordinate,
      orientation
    );
    usePositionStore().addPosition(position);

    const chair = new Chair(
      undefined,
      useRoomObjectStore().getNextId(),
      user,
      position
    );
    room.addRoomObject(chair);
    return useRoomObjectStore().addChair(chair);
  }

  addTable(roomId: string, xCoordinate: number, yCoordinate: number, orientation: number, length: number,
           width: number): string | undefined {
    const room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    const user = UserController.getUserController().getUser();
    const position = new Position(
      undefined,
      usePositionStore().nextId,
      user,
      xCoordinate,
      yCoordinate,
      orientation
    );
    usePositionStore().addPosition(position);

    const table = new Table(
      undefined,
      useRoomObjectStore().getNextId(),
      user,
      position,
      length,
      width
    );
    room.addRoomObject(table);
    return useRoomObjectStore().addTable(table);
  }

  getRoomObjects(roomId: string): RoomObject[] | undefined {
    return useRoomStore().getRoom(roomId)?.roomObjects;
  }

  getRoomObject(roomId: string, objectId: string): RoomObject | undefined {
    return useRoomStore().getRoom(roomId)?.roomObjects.find(object => object.getId === objectId);
  }

  async removeRoomObject(roomId: string, objectId: string) {
    const room = useRoomStore().getRoom(roomId);
    if (room) {
      const object = room.getRoomObject(objectId);
      if (object) {
        room.removeRoomObject(objectId);
        usePositionStore().deletePosition(object.position.getId);
        for (const arrangement of useSeatArrangementStore().getAllSeatArrangements()) {
          if (arrangement.room.getId === roomId) {
            const arrangementController = SeatArrangementController.getSeatArrangementController();
            await arrangementController.deleteMapping(arrangement.getId, object.getId);
          }
        }
        useRoomObjectStore().deleteRoomObject(objectId);
        await this.roomService.update(room);
      }
    }
  }
}
