import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";
import {RoomMapper} from "@/dto/mapper/rooms/RoomMapper";
import axios from "axios";

// TODO: URL
const ROOM_BASE_URL: string = '';

export class RoomService extends BaseService<Room, RoomDto> {

  private static roomService: RoomService = new RoomService();

  private constructor() {
    super(RoomMapper.getMapper());
  }

  static getService(): RoomService {
    return this.roomService;
  }

  add(room: Room) {
    const roomDto = this.getMapper().modelToDto(room);
    axios.post(ROOM_BASE_URL + '', roomDto).then((response) => {
      // irgendwas
    });
  }

  update(room: Room) {
    const roomDto = this.getMapper().modelToDto(room);
    axios.post(ROOM_BASE_URL + '', roomDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<Room | undefined> {
    let room;
    await axios.get(ROOM_BASE_URL + '').then((response) => {
      room = this.getMapper().dtoToModel(response.data);
    });

    if (room != undefined) {
      return room;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Room[]> {
    let rooms: Room[] = [];
    axios.get(ROOM_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        rooms.push(this.getMapper().dtoToModel(course));
      });
    });

    return rooms;
  }

  delete(id: string) {
    axios.delete(ROOM_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
