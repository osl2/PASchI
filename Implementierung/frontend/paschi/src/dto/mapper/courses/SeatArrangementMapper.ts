import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {UserController} from "@/controller/UserController";
import {Participant} from "@/model/userdata/interactions/Participant";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {useCourseStore} from "@/store/CourseStore";
import {RoomService} from "@/service/RoomService";
import {CourseService} from "@/service/CourseService";
import {useRoomStore} from "@/store/RoomStore";
import {useStudentStore} from "@/store/StudentStore";
import {useRoomObjectStore} from "@/store/RoomObjectStore";
import {ParticipantService} from "@/service/ParticipantService";

export class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

  private static mapper: SeatArrangementMapper = new SeatArrangementMapper();

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
      Object.fromEntries(seatMap),
      roomId,
      courseId
    );
  }


  async dtoToModel(arrangementDto: SeatArrangementDto): Promise<SeatArrangement> {
    const userController = UserController.getUserController();
    const courseService = CourseService.getService();
    const roomService = RoomService.getService();

    let course = useCourseStore().getCourse(arrangementDto.courseId);
    if (course == undefined) {
      course = await courseService.getById(arrangementDto.courseId);
    }
    let room = useRoomStore().getRoom(arrangementDto.roomId);
    if (room == undefined) {
      room = await roomService.getById(arrangementDto.roomId);
    }

    let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementDto.id);
    if (arrangement == undefined) {
      arrangement = new SeatArrangement(
        arrangementDto.id,
        0,
        userController.getUser(),
        arrangementDto.name,
        course!,
        room!
      );
      arrangement.createdAt = arrangementDto.createdAt;
      arrangement.updatedAt = arrangementDto.updatedAt;
      useSeatArrangementStore().addSeatArrangement(arrangement);
    } else if (arrangement.updatedAt === arrangementDto.updatedAt) {
      return arrangement;
    }

    const map = Object.entries(arrangementDto.seatMap);
    const seatMap: Map<RoomObject, Participant> = new Map<RoomObject, Participant>();
    for (const value of map) {
      let participant = useStudentStore().getParticipant(value[1]);
      if (participant == undefined) {
        participant = await ParticipantService.getService().getById(value[1]);
      }
      const roomObject = useRoomObjectStore().getChair(value[0])!;
      seatMap.set(roomObject, participant!);
    }

    arrangement.seatMap = seatMap;
    return arrangement;
  }
}
