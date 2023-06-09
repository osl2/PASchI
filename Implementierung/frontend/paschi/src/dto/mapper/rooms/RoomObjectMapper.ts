import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {ChairMapper} from "@/dto/mapper/rooms/ChairMapper";
import {TableMapper} from "@/dto/mapper/rooms/TableMapper";
import {TableDto} from "@/dto/userdata/rooms/TableDto";
import {ChairDto} from "@/dto/userdata/rooms/ChairDto";

export class RoomObjectMapper implements IModelDtoMapper<RoomObject, RoomObjectDto> {

  private static mapper: RoomObjectMapper = new RoomObjectMapper();
  private chairMapper = ChairMapper.getMapper();
  private tableMapper = TableMapper.getMapper();

  private constructor() {
  }

  static getMapper(): RoomObjectMapper {
    return RoomObjectMapper.mapper;
  }

  modelToDto(roomObject: RoomObject): RoomObjectDto {
    if (roomObject.isTable()) {
      return this.tableMapper.modelToDto(roomObject);
    } else {
      return this.chairMapper.modelToDto(roomObject);
    }
  }

  async dtoToModel(roomObjectDto: RoomObjectDto): Promise<RoomObject> {
    if (roomObjectDto.type == 'table') {
      return await this.tableMapper.dtoToModel(<TableDto> roomObjectDto);
    } else {
      return await this.chairMapper.dtoToModel(<ChairDto> roomObjectDto);
    }
  }
}
