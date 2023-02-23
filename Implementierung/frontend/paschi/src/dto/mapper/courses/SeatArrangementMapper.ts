import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {UserController} from "@/controller/UserController";
import {Participant} from "@/model/userdata/interactions/Participant";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";

export class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

  private static mapper: SeatArrangementMapper = new SeatArrangementMapper();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getMapper(): SeatArrangementMapper {
    return SeatArrangementMapper.mapper;
  }

  modelToDto(arrangement: SeatArrangement): SeatArrangementDto {
    const seatMap: Map<string, string> = new Map<string, string>();
    const roomId = arrangement.room.getId;
    const courseId = arrangement.course.getId;

    arrangement.seatMap.forEach((student: Participant, chair: RoomObject) => {
      seatMap.set(chair.getId, student.getId);
    });

    return new SeatArrangementDto(
      arrangement.getId,
      arrangement.user.getId,
      arrangement.createdAt,
      arrangement.updatedAt,
      arrangement.name,
      seatMap,
      roomId,
      courseId
    );
  }


  async dtoToModel(arrangementDto: SeatArrangementDto): Promise<SeatArrangement> {
    return undefined;
  }
}
