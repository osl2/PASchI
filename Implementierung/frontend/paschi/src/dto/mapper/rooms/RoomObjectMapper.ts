import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";

export class RoomObjectMapper implements IModelDtoMapper<RoomObject, RoomObjectDto> {

  private static mapper: RoomObjectMapper = new RoomObjectMapper();

  private constructor() {
  }

  static getMapper(): RoomObjectMapper {
    return RoomObjectMapper.mapper;
  }

  dtoToModel(roomObjectDto: RoomObjectDto): RoomObject {
    return undefined;
  }

  modelToDto(roomObject: RoomObject): RoomObjectDto {
    return undefined;
  }

}
