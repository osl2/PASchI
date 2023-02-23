import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {ChairDto} from "@/dto/userdata/rooms/ChairDto";
import {Chair} from "@/model/userdata/rooms/Chair";
import {PositionMapper} from "@/dto/mapper/rooms/PositionMapper";

export class ChairMapper implements IModelDtoMapper<Chair, ChairDto> {

  private static mapper: ChairMapper = new ChairMapper();
  private positionMapper = PositionMapper.getMapper();

  private constructor() {
  }

  static getMapper(): ChairMapper {
    return ChairMapper.mapper;
  }

  modelToDto(chair: Chair): ChairDto {
    return new ChairDto(
      chair.getId,
      chair.user.getId,
      chair.createdAt,
      chair.updatedAt,
      this.positionMapper.modelToDto(chair.position)
    );
  }

  async dtoToModel(chairDto: ChairDto): Promise<Chair> {
    return undefined;
  }
}
