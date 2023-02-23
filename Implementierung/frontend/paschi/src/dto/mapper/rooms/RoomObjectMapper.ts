import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {RoomObjectDto} from "@/dto/userdata/rooms/RoomObjectDto";
import {ChairMapper} from "@/dto/mapper/rooms/ChairMapper";
import {TableMapper} from "@/dto/mapper/rooms/TableMapper";
import {Table} from "@/model/userdata/rooms/Table";
import {Chair} from "@/model/userdata/rooms/Chair";

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
      return this.tableMapper.modelToDto(<Table> roomObject);
    } else {
      return this.chairMapper.modelToDto(<Chair> roomObject);
    }
  }

  async dtoToModel(roomObjectDto: RoomObjectDto): Promise<RoomObject> {
    return undefined;
  }
}
