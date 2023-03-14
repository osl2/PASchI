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
import {useSessionStore} from "@/store/SessionStore";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SessionService} from "@/service/SessionService";
import {SeatArrangementService} from "@/service/SeatArrangementService";

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
        for (const arrangement of useSeatArrangementStore().getAllSeatArrangements()) {
          if (arrangement.room.getId === roomId) {
            if (arrangement.seatMap.has(object)) {
              await this.replaceRoom(room);
              const arrangementController = SeatArrangementController.getSeatArrangementController();
              await arrangementController.deleteMapping(arrangement.getId, object.getId);
            }
            if (object.isTable()) {
              await this.replaceRoom(room);
            }
          }
        }
        room.removeRoomObject(objectId);
        usePositionStore().deletePosition(object.position.getId);
        useRoomObjectStore().deleteRoomObject(objectId);
        await this.roomService.update(room);
      }
    }
  }

  private async replaceRoom(room: Room) {
    let newRoom: Room | undefined;
    let map: Map<Chair, Chair>;
    let newArrangement: SeatArrangement | undefined;
    let oldArrangement: SeatArrangement | undefined;
    const sessions = useSessionStore().getAllSessions().filter(session =>
      session.seatArrangement.room.getId === room.getId);
    for (const session of sessions) {
      oldArrangement = session.seatArrangement;
      if (newRoom == undefined) {
        [newRoom, map] = (await this.copyRoom(room));
      }
      if (newArrangement == undefined) {
        newArrangement = new SeatArrangement(
          undefined,
          useSeatArrangementStore().getNextId(),
          oldArrangement.user,
          oldArrangement.name,
          oldArrangement.course,
          newRoom
        );
        for (const mapping of map!) {
          newArrangement.seatMap.set(mapping[1], oldArrangement.seatMap.get(mapping[0])!);
        }
        await SeatArrangementService.getService().add(newArrangement);
      }
      if (newArrangement) {
        session.seatArrangement = newArrangement;
        await SessionService.getService().update(session);
      }
    }
    if (oldArrangement && !oldArrangement.course.hasArrangement(oldArrangement.getId)) {
      await SeatArrangementController.getSeatArrangementController().deleteSeatArrangement(oldArrangement.getId);
    }
  }

  private async copyRoom(room: Room): Promise<[Room, Map<Chair, Chair>]> {
    const newRoom = new Room(
      undefined,
      useRoomStore().getNextId(),
      room.user,
      room.name
    );
    newRoom.visible = false;
    await this.roomService.add(newRoom);
    useRoomStore().addRoom(newRoom);

    const map = new Map<Chair, Chair>();
    for (const object of room.roomObjects) {
      let _object: RoomObject;
      const _position = new Position(undefined, usePositionStore().getNextId(), room.user,
        object.position.xCoordinate, object.position.yCoordinate, object.position.orientation);

      usePositionStore().addPosition(_position);

      if (object.isTable()) {
        _object = new Table(undefined, useRoomObjectStore().getNextId(), room.user, _position,
          object.dimensions.length, object.dimensions.width);

        useRoomObjectStore().addTable(_object);
        newRoom.addRoomObject(_object);
      } else {
        _object = new Chair(undefined, useRoomObjectStore().getNextId(), room.user, _position);
        useRoomObjectStore().addChair(_object);
        newRoom.addRoomObject(_object);
        map.set(object, _object);
      }
    }
    await this.roomService.update(newRoom);

    return [newRoom, map];
  }
}
