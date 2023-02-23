import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {UserController} from "@/controller/UserController";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useSessionStore} from "@/store/SessionStore";
import {useCourseStore} from "@/store/CourseStore";
import {CourseService} from "@/service/CourseService";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {InteractionDto} from "@/dto/userdata/interactions/InteractionDto";
import {InteractionMapper} from "@/dto/mapper/interactions/InteractionMapper";

export class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

  private static mapper: SessionMapper = new SessionMapper();
  private userController = UserController.getUserController();
  private interactionMapper = InteractionMapper.getMapper();
  private courseSerivce = CourseService.getService();
  private arrangementService = SeatArrangementService.getService();

  private constructor() {
  }

  static getMapper(): SessionMapper {
    return SessionMapper.mapper;
  }

  modelToDto(session: Session): SessionDto {
    const courseId = session.course.getId;
    const seatArrangementId = session.seatArrangement?.getId;
    const interactionDtos: InteractionDto[] = [];

    session.interactions.forEach((interaction: Interaction) => {
      interactionDtos.push(this.interactionMapper.modelToDto(interaction));
    });

    return new SessionDto(
      session.getId,
      session.user.getId,
      session.createdAt,
      session.updatedAt,
      session.name,
      session.date,
      courseId,
      seatArrangementId,
      interactionDtos
    )
  }

  async dtoToModel(sessionDto: SessionDto): Promise<Session> {
    let course = useCourseStore().getCourse(sessionDto.courseId);
    if (course == undefined) {
      course = await this.courseSerivce.getById(sessionDto.courseId);
    }
    let arrangement;
    if (sessionDto.seatArrangementId !== undefined) {
      arrangement = useSeatArrangementStore().getSeatArrangement(sessionDto.seatArrangementId);
      if (arrangement == undefined) {
        arrangement = await this.arrangementService.getById(sessionDto.seatArrangementId);
      }
    }

    let session = useSessionStore().getSession(sessionDto.id);
    if (session == undefined) {
      session = new Session(
        sessionDto.id,
        0,
        this.userController.getUser(),
        sessionDto.name,
        sessionDto.date,
        course!,
        arrangement
      );
      session.createdAt = sessionDto.createdAt;
      session.updatedAt = sessionDto.updatedAt;
      useSessionStore().addSession(session);
    } else if (session.updatedAt === sessionDto.updatedAt) {
      return session;
    } else {
      session.name = sessionDto.name;
      session.date = sessionDto.date;
    }

    const interactions: Interaction[] = [];
    for (const interactionDto of sessionDto.interactionDtos) {
      interactions.push(this.interactionMapper.dtoToModel(interactionDto));
    }

    session.interactions = interactions;
    return session;
  }
}
