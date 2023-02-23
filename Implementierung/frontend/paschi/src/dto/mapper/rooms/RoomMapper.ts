import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {RoomObjectMapper} from "@/dto/mapper/rooms/RoomObjectMapper";

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
    return undefined;
  }
}
