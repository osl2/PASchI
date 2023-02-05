import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {ChairDto} from "@/dto/userdata/rooms/ChairDto";
import {Chair} from "@/model/userdata/rooms/Chair";

export class ChairMapper implements IModelDtoMapper<Chair, ChairDto> {

  private static mapper: ChairMapper = new ChairMapper();

  private constructor() {
  }

  static getMapper(): ChairMapper {
    return ChairMapper.mapper;
  }

  dtoToModel(chairDto: ChairDto): Chair {
    return undefined;
  }

  modelToDto(chair: Chair): ChairDto {
    return undefined;
  }

}
