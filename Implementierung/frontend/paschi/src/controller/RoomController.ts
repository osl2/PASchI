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

// TODO: Backend Service einbinden
export class RoomController {
  private static controller: RoomController = new RoomController();
  private userController = UserController.getUserController();
  private arrangementController = SeatArrangementController.getSeatArrangementController();

  private constructor() {}

  static getRoomController(): RoomController {
    return this.controller;
  }

  createRoom(name: string): string {
    let room = new Room(
      undefined,
      useRoomStore().getNextId(),
      this.userController.getUser(),
      name
    );
    useRoomStore().addRoom(room);

    return room.getId;
  }

  updateRoom(id: string, name: string) {
    let room = useRoomStore().getRoom(id);
    if (room !== undefined) {
      room.name = name;
    }
  }

  deleteRoom(id: string) {
    let room = useRoomStore().getRoom(id);
    if (room !== undefined) {
      useSeatArrangementStore()
        .getAllSeatArrangements()
        .forEach((arrangement: SeatArrangement) => {
          if (arrangement.room.getId === id) {
            this.arrangementController.deleteSeatArrangement(arrangement.getId);
          }
        });
    }
    useRoomStore().deleteRoom(id);
  }

  getRoom(id: string): Room | undefined {
    let room = useRoomStore().getRoom(id);
    if (room == undefined) {
      return undefined;
    }
    return room;
  }

  getAllRooms(): Room[] {
    return useRoomStore().getAllRooms();
  }

  addChair(roomId: string, xCoordinate: number, yCoordinate: number, orientation: number): string | undefined {
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

    return chair.getId;
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

    return table.getId;
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

  removeRoomObject(roomId: string, objectId: string) {
    let room = useRoomStore().getRoom(roomId);
    if (room !== undefined) {
      let object = room.getRoomObject(objectId);
      if (object !== undefined) {
        room.removeRoomObject(objectId);
        usePositionStore().deletePosition(object.position.getId);
        useSeatArrangementStore().getAllSeatArrangements().forEach((arrangement: SeatArrangement) => {
          if (arrangement.room.getId === roomId) {
            arrangement.removeSeat(object!);
          }
        });
      }
    }
  }
}
