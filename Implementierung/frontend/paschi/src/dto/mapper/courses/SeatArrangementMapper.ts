import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {UserController} from "@/controller/UserController";

export class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

  private static mapper: SeatArrangementMapper = new SeatArrangementMapper();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getMapper(): SeatArrangementMapper {
    return SeatArrangementMapper.mapper;
  }

  dtoToModel(arrangementDto: SeatArrangementDto): SeatArrangement {
    return undefined;
  }

  modelToDto(arrangement: SeatArrangement): SeatArrangementDto {
    return undefined;
  }

}
