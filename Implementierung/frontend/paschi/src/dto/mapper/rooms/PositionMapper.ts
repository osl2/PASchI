import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Position} from "@/model/userdata/rooms/Position";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";

export class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

  private static mapper: PositionMapper = new PositionMapper();

  private constructor() {
  }

  static getMapper(): PositionMapper {
    return PositionMapper.mapper;
  }

  dtoToModel(positionDto: PositionDto): Position {
    return undefined;
  }

  modelToDto(position: Position): PositionDto {
    return undefined;
  }

}
