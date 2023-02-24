import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {ChairDto} from "@/dto/userdata/rooms/ChairDto";
import {Chair} from "@/model/userdata/rooms/Chair";
import {PositionMapper} from "@/dto/mapper/rooms/PositionMapper";
import {UserController} from "@/controller/UserController";
import {useRoomObjectStore} from "@/store/RoomObjectStore";

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
    const userController = UserController.getUserController();

    let chair = useRoomObjectStore().getChair(chairDto.id);
    if (chair == undefined) {
      chair = new Chair(
        chairDto.id,
        0,
        userController.getUser(),
        await this.positionMapper.dtoToModel(chairDto.position)
      );
      chair.updatedAt = chairDto.updatedAt;
      chair.createdAt = chairDto.createdAt;
      useRoomObjectStore().addChair(chair);
    } else if (chair.updatedAt === chairDto.updatedAt) {
      return chair;
    }

    chair.position = await this.positionMapper.dtoToModel(chairDto.position);
    return chair;
  }
}
