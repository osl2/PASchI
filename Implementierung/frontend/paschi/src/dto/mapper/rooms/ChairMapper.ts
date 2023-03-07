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

    const position = await this.positionMapper.dtoToModel(chairDto.position);

    let chair = useRoomObjectStore().getChairByTimeCreatedAndPosition(chairDto.createdAt, position);
    if (chair == undefined) {
      chair = new Chair(
        chairDto.id,
        0,
        userController.getUser(),
        position
      );
      chair.updatedAt = chairDto.updatedAt;
      chair.createdAt = chairDto.createdAt;
      useRoomObjectStore().addChair(chair);
    }

    chair.setId = chairDto.id;
    chair.position = position;
    return chair;
  }
}
