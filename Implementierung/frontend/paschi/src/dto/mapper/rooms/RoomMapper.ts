import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {RoomObjectMapper} from "@/dto/mapper/rooms/RoomObjectMapper";
import {useRoomStore} from "@/store/RoomStore";
import {UserController} from "@/controller/UserController";

export class RoomMapper implements IModelDtoMapper<Room, RoomDto> {

  private static mapper: RoomMapper = new RoomMapper();
  private roomObjectMapper = RoomObjectMapper.getMapper();

  private constructor() {
  }

  static getMapper(): RoomMapper {
    return RoomMapper.mapper;
  }

  modelToDto(room: Room): RoomDto {
    const roomObjectIds: RoomObjectDto[] = [];
    room.roomObjects.forEach((object: RoomObject) => {
      roomObjectIds.push(this.roomObjectMapper.modelToDto(object));
    });

    return new RoomDto(
      room.getId,
      room.user.getId,
      room.createdAt,
      room.updatedAt,
      room.name,
      roomObjectIds
    );
  }

  async dtoToModel(roomDto: RoomDto): Promise<Room> {
    const userController = UserController.getUserController();

    let room = useRoomStore().getRoom(roomDto.id);
    if (room == undefined) {
      room = new Room(
        roomDto.id,
        0,
        userController.getUser(),
        roomDto.name
      );
      room.createdAt = roomDto.createdAt;
      room.updatedAt = roomDto.updatedAt;
      useRoomStore().addRoom(room);
    } else if (room.updatedAt === roomDto.updatedAt) {
      return room;
    } else {
      room.name = roomDto.name;
    }

    const roomObjects: RoomObject[] = [];
    for (const object of roomDto.roomObjects) {
      roomObjects.push(await this.roomObjectMapper.dtoToModel(object));
    }

    room.roomObjects = roomObjects;
    return room;
  }
}
