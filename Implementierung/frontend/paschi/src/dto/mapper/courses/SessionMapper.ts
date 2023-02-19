import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {UserController} from "@/controller/UserController";
import {Interaction} from "@/model/userdata/interactions/Interaction";

export class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

  private static mapper: SessionMapper = new SessionMapper();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getMapper(): SessionMapper {
    return SessionMapper.mapper;
  }

  modelToDto(session: Session): SessionDto {
    const courseId = session.course.getId;
    const seatArrangementId = session.seatArrangement?.getId;
    const interactionIds: string[] = [];

    session.interactions.forEach((interaction: Interaction) => {
      interactionIds.push(interaction.getId);
    });

    return new SessionDto(
      session.getId,
      session.user.getId,
      session.createdAt,
      session.updatedAt,
      session.name,
      session.date,
      interactionIds,
      courseId,
      seatArrangementId
    )
  }

  dtoToModel(sessionDto: SessionDto): Session {
    return undefined;
  }
}
