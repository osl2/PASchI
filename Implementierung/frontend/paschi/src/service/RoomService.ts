import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";
import {RoomMapper} from "@/dto/mapper/rooms/RoomMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const ROOM_BASE_URL: string = 'http://193.196.37.141/api/room';

export class RoomService extends BaseService<Room, RoomDto> {

  private static roomService: RoomService = new RoomService();

  private constructor() {
    super(RoomMapper.getMapper());
  }

  static getService(): RoomService {
    return this.roomService;
  }

  add(room: Room) {
    const token = useUserStore().getUser()?.token;
    const roomDto = this.getMapper().modelToDto(room);
    axios.post(ROOM_BASE_URL, roomDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update(room: Room) {
    const token = useUserStore().getUser()?.token;
    const roomDto = this.getMapper().modelToDto(room);
    axios.put(ROOM_BASE_URL, roomDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Room | undefined> {
    const token = useUserStore().getUser()?.token;
    let room;
    await axios.get(ROOM_BASE_URL + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<RoomDto>) => {
      room = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (room != undefined) {
      return room;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Room[]> {
    const token = useUserStore().getUser()?.token;
    let rooms: Room[] = [];
    await axios.get(ROOM_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<RoomDto[]>) => {
      response.data.forEach((roomDto: RoomDto) => {
        rooms.push(this.getMapper().dtoToModel(roomDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return rooms;
  }

  delete(id: string) {
    const token = useUserStore().getUser()?.token;
    axios.delete(ROOM_BASE_URL, {
      params: {
        id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
