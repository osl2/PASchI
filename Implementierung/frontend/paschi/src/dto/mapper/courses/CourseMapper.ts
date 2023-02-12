import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {Session} from "@/model/userdata/courses/Session";
import {Participant} from "@/model/userdata/interactions/Participant";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {UserController} from "@/controller/UserController";
// import {SessionService} from "@/service/SessionService";
// import {ParticipantService} from "@/service/ParticipantService";
// import {SeatArrangementService} from "@/service/SeatArrangementService";

export class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

  private static mapper: CourseMapper = new CourseMapper();
  private userController = UserController.getUserController();
  // private sessionService = new SessionService();
  // private participantService = new ParticipantService();
  // private arrangementService = new SeatArrangementService();

  private constructor() {
  }

  static getMapper(): IModelDtoMapper<Course, CourseDto> {
    return CourseMapper.mapper;
  }

  modelToDto(course: Course): CourseDto {
    let sessionIds: string[] = [];
    let participantIds: string[] = [];
    let arrangementIds: string[] = [];

    course.sessions.forEach((session: Session) => sessionIds.push(session.getId));
    course.participants.forEach((participant: Participant) => participantIds.push(participant.getId));
    course.seatArrangements.forEach((arrangement: SeatArrangement) => arrangementIds.push(arrangement.getId));

    return new CourseDto(
      course.getId,
      course.user.getId,
      course.createdAt,
      course.updatedAt,
      course.name,
      course.subject,
      sessionIds,
      participantIds,
      arrangementIds
    );
  }

  dtoToModel(courseDto: any): Course {
    const sessions: Session[] = [];
    const participants: Participant[] = [];
    const arrangements: SeatArrangement[] = [];
    const user = this.userController.getUser();

    courseDto.sessionIds.forEach((id: string) => {
      // TODO: Service implementieren
      // sessions.push(this.sessionService.getById(id));
    });
    courseDto.participantIds.forEach((id: string) => {
      // TODO: Service implementieren
      // participants.push(this.participantService.getById(id));
      // const student = useStudentStore().getStudent(id);
      // if (student !== undefined) {
      //   participants.push();
      // }
    });
    courseDto.seatArrangementIds.forEach((id: string) => {
      // TODO: Service implementieren
      // arrangements.push(this.arrangementService.getById(id));
    });

    const course = new Course(courseDto.id, 0, user, courseDto.name, courseDto.subject);
    course.sessions = sessions;
    course.participants = participants;
    course.seatArrangements = arrangements;

    return course;
  }
}
