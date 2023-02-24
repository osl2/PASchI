import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Position} from "@/model/userdata/rooms/Position";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";
import {UserController} from "@/controller/UserController";
import {usePositionStore} from "@/store/PositionStore";

export class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

  private static mapper: PositionMapper = new PositionMapper();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getMapper(): PositionMapper {
    return PositionMapper.mapper;
  }

  modelToDto(position: Position): PositionDto {
    return new PositionDto(
      position.getId,
      position.user.getId,
      position.createdAt,
      position.updatedAt,
      position.xCoordinate,
      position.yCoordinate,
      position.orientation
    );
  }

  async dtoToModel(positionDto: PositionDto): Promise<Position> {
    let position = usePositionStore().getPosition(positionDto.id);
    if (position == undefined) {
      position = new Position(
        positionDto.id,
        0,
        this.userController.getUser(),
        positionDto.xcoordinate,
        positionDto.ycoordinate,
        positionDto.orientation
      );
      usePositionStore().addPosition(position);
    } else if (positionDto.updatedAt <= position.updatedAt && positionDto.createdAt >= position.createdAt) {
      return position;
    } else {
      position.xCoordinate = positionDto.xcoordinate;
      position.yCoordinate = positionDto.ycoordinate;
      position.orientation = positionDto.orientation;
    }
    if (positionDto.createdAt < position.createdAt) {
      usePositionStore().addPosition(position);
    }

    return position;
  }
}
