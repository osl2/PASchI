import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomDto} from "@/dto/userdata/rooms/RoomDto";

export class RoomMapper implements IModelDtoMapper<Room, RoomDto> {

  private static mapper: RoomMapper = new RoomMapper();

  private constructor() {
  }

  static getMapper(): RoomMapper {
    return RoomMapper.mapper;
  }

  dtoToModel(roomDto: RoomDto): Room {
    return undefined;
  }

  modelToDto(room: Room): RoomDto {
    return undefined;
  }

}
