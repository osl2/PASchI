import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {Session} from "@/model/userdata/courses/Session";
import {Participant} from "@/model/userdata/interactions/Participant";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {UserController} from "@/controller/UserController";
import {useCourseStore} from "@/store/CourseStore";
import {useStudentStore} from "@/store/StudentStore";
import {ParticipantService} from "@/service/ParticipantService";
import {useSessionStore} from "@/store/SessionStore";
import {SessionService} from "@/service/SessionService";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";

export class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

  private static mapper: CourseMapper = new CourseMapper();

  private constructor() {
  }

  static getMapper(): IModelDtoMapper<Course, CourseDto> {
    return CourseMapper.mapper;
  }

  modelToDto(course: Course): CourseDto {
    const sessionIds: string[] = [];
    const participantIds: string[] = [];
    const arrangementIds: string[] = [];

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

  async dtoToModel(courseDto: CourseDto): Promise<Course> {
    const userController = UserController.getUserController();

    let course = useCourseStore().getCourse(courseDto.id);
    if (course == undefined) {
      course = new Course(
        courseDto.id,
        0,
        userController.getUser(),
        courseDto.name,
        courseDto.subject
      );
      course.createdAt = courseDto.createdAt;
      course.updatedAt = courseDto.updatedAt;
      useCourseStore().addCourse(course);
    } else if (course.updatedAt === courseDto.updatedAt) {
      return course;
    } else {
      course.name = courseDto.name;
      course.subject = courseDto.subject;
    }

    const sessionService = SessionService.getService();
    const participantService = ParticipantService.getService();
    const arrangementService = SeatArrangementService.getService();

    const sessions: Session[] = [];
    const participants: Participant[] = [];
    const arrangements: SeatArrangement[] = [];

    for (const id of courseDto.participantIds) {
      let participant = useStudentStore().getStudent(id);
      if (participant == undefined) {
        participant = await participantService.getById(id);
      }
      if (participant !== undefined) {
        participants.push(participant);
      }
    }

    for (const id of courseDto.sessionIds) {
      let session = useSessionStore().getSession(id);
      if (session == undefined) {
        session = await sessionService.getById(id);
      }
      if (session !== undefined) {
        sessions.push(session);
      }
    }

    for (const id of courseDto.seatArrangementIds) {
      let arrangement = useSeatArrangementStore().getSeatArrangement(id);
      if (arrangement == undefined) {
        arrangement = await arrangementService.getById(id);
      }
      if (arrangement !== undefined) {
        arrangements.push(arrangement);
      }
    }

    course.participants = participants;
    course.sessions = sessions;
    course.seatArrangements = arrangements;

    return course;
  }
}
