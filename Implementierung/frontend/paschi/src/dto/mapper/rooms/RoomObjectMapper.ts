import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {PositionMapper} from "@/dto/mapper/rooms/PositionMapper";

export class RoomObjectMapper implements IModelDtoMapper<RoomObject, RoomObjectDto> {

  private static mapper: RoomObjectMapper = new RoomObjectMapper();
  private positionMapper = PositionMapper.getMapper();

  private constructor() {
  }

  static getMapper(): RoomObjectMapper {
    return RoomObjectMapper.mapper;
  }

  modelToDto(roomObject: RoomObject): RoomObjectDto {
    return new RoomObjectDto(
      roomObject.getId,
      roomObject.user.getId,
      roomObject.createdAt,
      roomObject.updatedAt,
      this.positionMapper.modelToDto(roomObject.position)
    );
  }

  dtoToModel(roomObjectDto: RoomObjectDto): RoomObject {
    return undefined;
  }
}
