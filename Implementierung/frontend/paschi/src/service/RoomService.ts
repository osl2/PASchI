import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";

const ROOM_BASE_URL: string = '';

export class RoomService extends BaseService<Room, RoomDto> {

  constructor() {
    super(RoomMapper.getMapper());
  }

  add(e: Room) {
  }

  update(e: Room) {
  }

  getById(id: string): Room {
  }

  getAll(): Room[] {
  }

  delete(id: string) {
  }
}
