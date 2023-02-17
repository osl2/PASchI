import {BaseService} from "@/service/BaseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";
import {RoomMapper} from "@/dto/mapper/rooms/RoomMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const ROOM_BASE_URL: string = 'http://193.196.37.141/api/room';

export class RoomService extends BaseService<Room, RoomDto> {

  private static roomService: RoomService = new RoomService();
  private userStore = useUserStore();

  private constructor() {
    super(RoomMapper.getMapper());
  }

  static getService(): RoomService {
    return this.roomService;
  }

  add(room: Room) {
    const roomDto = this.getMapper().modelToDto(room);
    axios.post(ROOM_BASE_URL, roomDto).catch((error) => {
      console.log(error);
    });
  }

  update(room: Room) {
    const token = this.userStore.getUser()?.token;
    const roomDto = this.getMapper().modelToDto(room);
    axios.put(ROOM_BASE_URL, roomDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Room | undefined> {
    const token = this.userStore.getUser()?.token;
    let room;
    await axios.get(ROOM_BASE_URL + `/${id}`, {
      headers: {
        'Authorization': token
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
    const token = this.userStore.getUser()?.token;
    let rooms: Room[] = [];
    axios.get(ROOM_BASE_URL, {
      headers: {
        'Authorization': token
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
    const token = this.userStore.getUser()?.token;
    axios.delete(ROOM_BASE_URL, {
      params: {
        id
      },
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
