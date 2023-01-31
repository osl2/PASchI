import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";

export class RoomService extends BaseService<Room, RoomDto> {

  private readonly ROOM_BASE_URL: string;

  constructor(base_url: string, ROOM_BASE_URL: string) {
    super(base_url);
    this.ROOM_BASE_URL = ROOM_BASE_URL;
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
