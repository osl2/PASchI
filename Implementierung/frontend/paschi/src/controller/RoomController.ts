import { Room } from "@/model/userdata/rooms/Room";
import { Position } from "@/model/userdata/rooms/Position";
import { useRoomStore } from "@/store/RoomStore";
import { UserController } from "@/controller/UserController";
import { Chair } from "@/model/userdata/rooms/Chair";
import { useRoomObjectStore } from "@/store/RoomObjectStore";
import { Table } from "@/model/userdata/rooms/Table";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { useSeatArrangementStore } from "@/store/SeatArrangementStore";
import { usePositionStore } from "@/store/PositionStore";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {RoomService} from "@/service/RoomService";
import {SeatArrangementService} from "@/service/SeatArrangementService";

export class RoomController {
  private static controller: RoomController = new RoomController();
  private userController = UserController.getUserController();
  private roomService = RoomService.getService();

  private constructor() {}

  static getRoomController(): RoomController {
    return this.controller;
  }

  async createRoom(name: string): Promise<string> {
    let room = new Room(
      undefined,
      useRoomStore().getNextId(),
      this.userController.getUser(),
      name
    );

    await this.roomService.add(room);
    return useRoomStore().addRoom(room);
  }

  async updateRoom(id: string) {
    let room = useRoomStore().getRoom(id);
    if (room) {
      await this.roomService.update(room);
    }
  }

  async deleteRoom(id: string) {
    const arrangementController = SeatArrangementController.getSeatArrangementController();
    let room = useRoomStore().getRoom(id);
    if (room !== undefined) {
      useSeatArrangementStore()
        .getAllSeatArrangements()
        .forEach((arrangement: SeatArrangement) => {
          if (arrangement.room.getId === id) {
            arrangementController.deleteSeatArrangement(arrangement.getId);
          }
        });
    }
    useRoomStore().deleteRoom(id);
    await this.roomService.delete(id);
  }

  getRoom(id: string): Room | undefined {
    let room = useRoomStore().getRoom(id);
    if (room == undefined) {
      return undefined;
    }
    return room;
  }

  getAllRooms(): Room[] {
    this.roomService.getAll().then();
    return useRoomStore().getAllRooms();
  }

  async addChair(roomId: string, xCoordinate: number, yCoordinate: number, orientation: number): Promise<string | undefined> {
    let room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    const position = new Position(
      undefined,
      usePositionStore().nextId,
      this.userController.getUser(),
      xCoordinate,
      yCoordinate,
      orientation
    );
    usePositionStore().addPosition(position);

    let chair = new Chair(
      undefined,
      useRoomObjectStore().getNextId(),
      this.userController.getUser(),
      position
    );
    room.addRoomObject(chair);
    await this.roomService.update(room).then();

    return useRoomObjectStore().addChair(chair);
  }

  addTable(roomId: string, xCoordinate: number, yCoordinate: number, orientation: number, length: number,
           width: number): string | undefined {
    let room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    const position = new Position(
      undefined,
      usePositionStore().nextId,
      this.userController.getUser(),
      xCoordinate,
      yCoordinate,
      orientation
    );
    usePositionStore().addPosition(position);

    let table = new Table(
      undefined,
      useRoomObjectStore().getNextId(),
      this.userController.getUser(),
      position,
      length,
      width
    );
    room.addRoomObject(table);
    this.roomService.update(room).then();

    return useRoomObjectStore().addTable(table);
  }

  getRoomObjects(roomId: string): RoomObject[] | undefined {
    let room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    return room.roomObjects;
  }

  getRoomObject(roomId: string, objectId: string): RoomObject | undefined {
    let room = useRoomStore().getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }
    room.roomObjects.forEach((object: RoomObject) => {
      if (object.getId === objectId) {
        return object;
      }
    });
  }

  async removeRoomObject(roomId: string, objectId: string) {
    let room = useRoomStore().getRoom(roomId);
    if (room !== undefined) {
      let object = room.getRoomObject(objectId);
      if (object !== undefined) {
        room.removeRoomObject(objectId);
        usePositionStore().deletePosition(object.position.getId);
        useSeatArrangementStore().getAllSeatArrangements().forEach((arrangement: SeatArrangement) => {
          if (arrangement.room.getId === roomId) {
            arrangement.removeSeat(object!);
            SeatArrangementService.getService().update(arrangement);
          }
        });
        await this.roomService.update(room);
      }
    }
  }
}
