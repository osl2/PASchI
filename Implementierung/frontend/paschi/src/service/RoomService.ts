import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";

const ROOM_BASE_URL: string = "";

export class RoomService extends BaseService<Room, RoomDto> {

  constructor() {
    super(ROOM_BASE_URL);
  }

  add(e: Room) {
    super.add(e);
  }

  update(e: Room) {
    super.update(e);
  }

  getById(id: string) {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }
}
