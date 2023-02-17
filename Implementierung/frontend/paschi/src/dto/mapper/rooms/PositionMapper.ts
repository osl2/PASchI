import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Position} from "@/model/userdata/rooms/Position";
import {PositionDto} from "@/dto/userdata/rooms/PositionDto";
import {UserController} from "@/controller/UserController";
import {usePositionStore} from "@/store/PositionStore";

export class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

  private static mapper: PositionMapper = new PositionMapper();
  private userController = UserController.getUserController();
  private positionStore = usePositionStore();

  private constructor() {
  }

  static getMapper(): PositionMapper {
    return PositionMapper.mapper;
  }

  modelToDto(position: Position): PositionDto {
    return new PositionDto(
      position.getId,
      this.userController.getUser().getId,
      position.createdAt,
      position.updatedAt,
      position.xCoordinate,
      position.yCoordinate,
      position.orientation
    );
  }

  dtoToModel(positionDto: PositionDto): Position {
    let position = this.positionStore.getPosition(positionDto.id);
    if (position == undefined) {
      position = new Position(
        positionDto.id,
        0,
        this.userController.getUser(),
        positionDto.xCoordinate,
        positionDto.yCoordinate,
        positionDto.orientation
      );
      this.positionStore.addPosition(position);
    } else if (positionDto.updatedAt <= position.updatedAt && positionDto.createdAt >= position.createdAt) {
      return position;
    } else {
      position.xCoordinate = positionDto.xCoordinate;
      position.yCoordinate = positionDto.yCoordinate;
      position.orientation = positionDto.orientation;
    }
    if (positionDto.createdAt < position.createdAt) {
      this.positionStore.addPosition(position);
    }

    return position;
  }
}
