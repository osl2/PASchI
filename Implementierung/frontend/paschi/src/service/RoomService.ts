import {BASE_URL, BaseService} from "@/service/BaseService";
import { Room } from "@/model/userdata/rooms/Room";
import { RoomDto } from "@/dto/userdata/rooms/RoomDto";
import { RoomMapper } from "@/dto/mapper/rooms/RoomMapper";
import axios, { AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

const ROOM_BASE_URL: string = BASE_URL + "/api/room";

export class RoomService extends BaseService<Room, RoomDto> {

  private static roomService: RoomService = new RoomService();

  private constructor() {
    super(RoomMapper.getMapper());
  }

  static getService(): RoomService {
    return this.roomService;
  }

  async add(room: Room) {
    const token = useUserStore().getUser()?.token;
    const roomDto = this.getMapper().modelToDto(room);
    await axios
      .post(ROOM_BASE_URL, roomDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<RoomDto>) => {
        room.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(room: Room) {
    const token = useUserStore().getUser()?.token;
    const roomDto = this.getMapper().modelToDto(room);
    await axios
      .put(ROOM_BASE_URL, roomDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<RoomDto>) => {
        await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<Room | undefined> {
    const token = useUserStore().getUser()?.token;
    let room;
    await axios
      .get(ROOM_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<RoomDto>) => {
        room = await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    return room;
  }

  async getAll(): Promise<Room[]> {
    const token = useUserStore().getUser()?.token;
    const rooms: Room[] = [];
    await axios
      .get(ROOM_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<RoomDto[]>) => {
        for (const roomDto of response.data) {
          rooms.push(await this.getMapper().dtoToModel(roomDto));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return rooms;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(ROOM_BASE_URL, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
