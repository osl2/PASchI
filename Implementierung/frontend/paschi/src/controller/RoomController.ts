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

// TODO: Backend Service einbinden
export class RoomController {
  private static controller: RoomController = new RoomController();
  private userController = UserController.getUserController();
  private roomStore = useRoomStore();
  private roomObjectStore = useRoomObjectStore();
  private arrangementStore = useSeatArrangementStore();
  private positionStore = usePositionStore();

  private constructor() {}

  static getRoomController(): RoomController {
    return RoomController.controller;
  }

  createRoom(name: string): string {
    let room = new Room(
      undefined,
      this.roomStore.getNextId(),
      this.userController.getUser(),
      name
    );
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
    let room = this.roomStore.getRoom(id);
    if (room !== undefined) {
      this.arrangementStore
        .getAllSeatArrangements()
        .forEach((arrangement: SeatArrangement) => {
          if (arrangement.room.getId === id) {
            this.arrangementStore.deleteSeatArrangement(arrangement.getId);
          }
        });
    }
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

  addChair(
    roomId: string,
    xCoordinate: number,
    yCoordinate: number,
    orientation: number
  ): string | undefined {
    let room = this.roomStore.getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    let chair = new Chair(
      undefined,
      this.roomObjectStore.getNextId(),
      this.userController.getUser(),
      new Position(
        undefined,
        this.positionStore.nextId,
        this.userController.getUser(),
        xCoordinate,
        yCoordinate,
        orientation
      )
    );
    room.addRoomObject(chair);

    return chair.getId;
  }

  addTable(
    roomId: string,
    xCoordinate: number,
    yCoordinate: number,
    orientation: number,
    length: number,
    width: number
  ): string | undefined {
    let room = this.roomStore.getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    let table = new Table(
      undefined,
      this.roomObjectStore.getNextId(),
      this.userController.getUser(),
      new Position(
        undefined,
        this.positionStore.nextId,
        this.userController.getUser(),
        xCoordinate,
        yCoordinate,
        orientation
      ),
      length,
      width
    );
    room.addRoomObject(table);

    return table.getId;
  }

  getRoomObjects(roomId: string): RoomObject[] | undefined {
    let room = this.roomStore.getRoom(roomId);
    if (room == undefined) {
      return undefined;
    }

    return room.roomObjects;
  }

  getRoomObject(roomId: string, objectId: string): RoomObject | undefined {
    let room = this.roomStore.getRoom(roomId);
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
    let room = this.roomStore.getRoom(roomId);
    if (room !== undefined) {
      room.removeRoomObject(objectId);
    }
  }
}
